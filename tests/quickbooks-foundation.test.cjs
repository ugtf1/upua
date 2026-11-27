const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const path = require('node:path');

const dir = process.env.QB_TEST_COMPILED_DIR;
if (!dir) throw new Error('Run scripts/test-quickbooks-foundation.sh');
const { encryptQuickBooksCredentials, decryptQuickBooksCredentials } = require(path.join(dir, 'quickbooks-credentials.js'));
const { createQuickBooksOAuthState, consumeQuickBooksOAuthState } = require(path.join(dir, 'quickbooks-oauth-state.js'));
const { getQuickBooksAccess, saveQuickBooksCredentials, quickBooksTokenRefresher } = require(path.join(dir, 'quickbooks-token-store.js'));

const key = randomBytes(32).toString('base64');
const credentials = { accessToken: 'private-access-token', refreshToken: 'private-refresh-token', realmId: '123456', expiresAt: 1000000 };

test('credentials encrypt with authentication, reject wrong keys, and do not store plaintext', () => {
  const encrypted = encryptQuickBooksCredentials(credentials, key);
  assert.equal(encrypted.includes(credentials.accessToken), false);
  assert.notEqual(encrypted, encryptQuickBooksCredentials(credentials, key));
  assert.deepEqual(decryptQuickBooksCredentials(encrypted, key), credentials);
  assert.throws(() => decryptQuickBooksCredentials(encrypted, randomBytes(32).toString('base64')));
  assert.throws(() => encryptQuickBooksCredentials(credentials, 'bad-key'));
  const chunks = encrypted.split('.');
  chunks[3] = (chunks[3][0] === 'A' ? 'B' : 'A') + chunks[3].slice(1);
  assert.throws(() => decryptQuickBooksCredentials(chunks.join('.'), key));
});

test('OAuth state is bound to the verified session, expires, and is consumed once', async () => {
  const rows = new Map();
  const db = { quickBooksOAuthState: {
    create: async ({data}) => rows.set(data.stateHash, data),
    deleteMany: async ({where}) => {
      const row = rows.get(where.stateHash);
      if (!row || row.sessionHash !== where.sessionHash || !(row.expiresAt > where.expiresAt.gt)) return { count: 0 };
      rows.delete(where.stateHash);
      return { count: 1 };
    },
  } };
  const state = await createQuickBooksOAuthState(db, 'admin-session-a', 1000);
  assert.equal([...rows.values()][0].stateHash.includes(state), false);
  assert.equal(await consumeQuickBooksOAuthState(db, state, 'admin-session-b', 1001), false);
  const result = await Promise.all([consumeQuickBooksOAuthState(db, state, 'admin-session-a', 1002), consumeQuickBooksOAuthState(db, state, 'admin-session-a', 1002)]);
  assert.deepEqual(result.sort(), [false, true]);
  const expired = await createQuickBooksOAuthState(db, 'admin-session-a', 1000);
  assert.equal(await consumeQuickBooksOAuthState(db, expired, 'admin-session-a', 601000), false);
  await assert.rejects(createQuickBooksOAuthState(db, '', 0));
});

function fakeLockedStore() {
  let encrypted = null;
  let queued = Promise.resolve();
  return {
    withLock: async action => {
      const previous = queued;
      let release;
      queued = new Promise(resolve => { release = resolve; });
      await previous;
      try { return await action({ read: async () => encrypted, write: async value => { encrypted = value; }, remove: async () => { encrypted = null; } }); }
      finally { release(); }
    },
  };
}

test('concurrent refreshes share a lock and reuse the rotated credentials', async () => {
  const store = fakeLockedStore();
  await saveQuickBooksCredentials(store, key, credentials);
  let calls = 0;
  const refresh = async token => {
    calls++;
    assert.equal(token, credentials.refreshToken);
    await new Promise(resolve => setTimeout(resolve, 10));
    return { access_token: 'new-access', refresh_token: 'new-refresh', expires_in: 3600 };
  };
  const results = await Promise.all(Array.from({length: 8}, () => getQuickBooksAccess(store, key, refresh, () => 1000000)));
  assert.equal(calls, 1);
  assert.ok(results.every(value => value.accessToken === 'new-access' && value.realmId === '123456'));
  let observedToken;
  await getQuickBooksAccess(store, key, async token => {
    observedToken = token;
    return { access_token: 'third', refresh_token: 'third-refresh', expires_in: 3600 };
  }, () => 4600000);
  assert.equal(observedToken, 'new-refresh');
});

test('refresh failures do not overwrite the previous stored credentials', async () => {
  const store = fakeLockedStore();
  await saveQuickBooksCredentials(store, key, credentials);
  await assert.rejects(getQuickBooksAccess(store, key, async () => ({ access_token: 'new', expires_in: 3600 }), () => 1000000));
  let token;
  await getQuickBooksAccess(store, key, async value => {
    token = value;
    return { access_token: 'new', refresh_token: 'rotated', expires_in: 3600 };
  }, () => 1000000);
  assert.equal(token, credentials.refreshToken);
});

test('provider errors exclude response body and secrets', async () => {
  const refresh = quickBooksTokenRefresher('client-id', 'client-secret', async () => new Response('sensitive-provider-error', { status: 400 }));
  await assert.rejects(refresh('refresh-token'), error => error.message === 'QuickBooks token refresh failed (400)');
});
