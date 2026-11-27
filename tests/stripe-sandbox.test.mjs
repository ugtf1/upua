import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSandboxLines, createSandboxCheckout } from '../lib/stripe-sandbox.ts';

const catalog = [
  { id: 'shirt', title: 'Shirt', price: 20, category: 'Apparel', options: ['Blue', 'Red'], inStock: true },
  { id: 'ad', title: 'Advert', price: 150, category: 'Convention Packages', options: ['Full - $150', 'Half - $100'], inStock: true },
  { id: 'convention-cultural-gala-ticket', title: 'Gala', price: 150, category: 'Convention Packages', inStock: true },
  { id: 'unavailable', title: 'Unavailable', price: 5, category: 'Apparel', inStock: false },
];
const config = { nodeEnv: 'development', enabled: '1', secret: 'sk_test_valid123', origin: 'http://localhost:3000', webhookSecret: 'whsec_testsecret' };
const item = { productId: 'shirt', quantity: 2, selectedOption: 'Blue' };
const session = { id: 'cs_test_123', livemode: false, url: 'https://checkout.stripe.com/c/pay/cs_test_123' };

test('derives price, option and shipping from server catalog', () => {
  assert.deepEqual(buildSandboxLines([item, { productId: 'ad', quantity: 1, selectedOption: 'Half - $100' }], catalog), [
    { name: 'Shirt — Blue', unitAmount: 2000, quantity: 2 },
    { name: 'Advert — Half - $100', unitAmount: 10000, quantity: 1 },
    { name: 'Shipping', unitAmount: 800, quantity: 1 },
  ]);
});

test('rejects tampering, unrecognized variants and unsupported registration', () => {
  for (const bad of [
    { ...item, amount: 1 }, { ...item, selectedOption: 'Blue - $1' },
    { ...item, quantity: -1 }, { ...item, quantity: 1.5 }, { ...item, quantity: 26 },
    { productId: 'not-a-product', quantity: 1 }, { productId: 'unavailable', quantity: 1 },
    { productId: 'convention-cultural-gala-ticket', quantity: 1 },
  ]) assert.throws(() => buildSandboxLines([bad], catalog));
});

test('production, disabled mode, live credentials and nonlocal returns fail closed before network', async () => {
  let calls = 0;
  const never = async () => { calls++; throw new Error('should not be called'); };
  for (const overrides of [
    { nodeEnv: 'production' }, { enabled: undefined }, { secret: 'sk_live_123' },
    { secret: 'sk_test_placeholder' }, { webhookSecret: undefined }, { origin: 'https://example.com' },
    { origin: 'http://localhost.evil.example:3000' }, { origin: 'http://localhost:3000/path' },
  ]) await assert.rejects(createSandboxCheckout([item], catalog, { ...config, ...overrides }, 'order1', never));
  assert.equal(calls, 0);
});

test('opens only verified test-mode Stripe checkout with calculated amounts', async () => {
  let form;
  const url = await createSandboxCheckout([item], catalog, config, 'order1', async (endpoint, options) => {
    assert.equal(endpoint, 'https://api.stripe.com/v1/checkout/sessions');
    assert.equal(options.method, 'POST');
    form = new URLSearchParams(options.body);
    return { ok: true, json: async () => session };
  });
  assert.deepEqual(url, { url: session.url, sessionId: session.id });
  assert.equal(form.get('client_reference_id'), 'order1');
  assert.equal(form.get('line_items[0][price_data][unit_amount]'), '2000');
  assert.equal(form.get('line_items[0][quantity]'), '2');
  assert.equal(form.get('line_items[1][price_data][unit_amount]'), '800');
  assert.equal(form.get('success_url'), 'http://localhost:3000/store?checkout=test-return');
});

test('rejects failed, live and untrusted Stripe responses', async () => {
  for (const data of [
    { ...session, livemode: true }, { ...session, id: 'cs_live_123' },
    { ...session, url: 'https://checkout.stripe.com.evil.example/' },
    { ...session, url: 'https://attacker@checkout.stripe.com/' },
  ]) await assert.rejects(createSandboxCheckout([item], catalog, config, 'order1', async () => ({ ok: true, json: async () => data })));
  await assert.rejects(createSandboxCheckout([item], catalog, config, 'order1', async () => ({ ok: false })));
});
