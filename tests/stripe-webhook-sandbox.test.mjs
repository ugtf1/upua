import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { getSandboxWebhookAction, verifySandboxStripeSignature } from '../lib/stripe-webhook-sandbox.ts';

const secret = 'whsec_sandboxsecret';
const timestamp = 1700000000;
const now = timestamp * 1000;
const session = { id: 'cs_test_123', client_reference_id: 'order123', amount_total: 4800, currency: 'usd', livemode: false, payment_status: 'paid' };
const event = { livemode: false, type: 'checkout.session.completed', data: { object: session } };
const payload = JSON.stringify(event);
const sign = (body, time = timestamp) => createHmac('sha256', secret).update(`${time}.${body}`).digest('hex');

test('validates signature over exact raw body, timestamp and all v1 signatures', () => {
  assert.equal(verifySandboxStripeSignature(payload, `t=${timestamp},v1=${sign(payload)}`, secret, now), true);
  assert.equal(verifySandboxStripeSignature(payload, `t=${timestamp},v1=${'0'.repeat(64)},v1=${sign(payload)}`, secret, now), true);
  assert.equal(verifySandboxStripeSignature(payload + ' ', `t=${timestamp},v1=${sign(payload)}`, secret, now), false);
  assert.equal(verifySandboxStripeSignature(payload, `t=${timestamp},v1=${sign(payload)}`, secret, now + 301000), false);
  assert.equal(verifySandboxStripeSignature(payload, `t=${timestamp},t=${timestamp},v1=${sign(payload)}`, secret, now), false);
  assert.equal(verifySandboxStripeSignature(payload, `t=${timestamp},v1=bogus`, secret, now), false);
});

test('only verified paid test-mode sessions can mark an order paid', () => {
  assert.deepEqual(getSandboxWebhookAction(event), { orderId: 'order123', sessionId: 'cs_test_123', amountCents: 4800, status: 'paid' });
  assert.equal(getSandboxWebhookAction({ ...event, livemode: true }), null);
  assert.equal(getSandboxWebhookAction({ ...event, data: { object: { ...session, payment_status: 'unpaid' } } }), null);
  assert.equal(getSandboxWebhookAction({ ...event, data: { object: { ...session, id: 'cs_live_123' } } }), null);
  assert.equal(getSandboxWebhookAction({ ...event, data: { object: { ...session, currency: 'eur' } } }), null);
  assert.equal(getSandboxWebhookAction({ ...event, type: 'payment_intent.succeeded' }), null);
});

test('tracks asynchronous failures and expired sessions without marking them paid', () => {
  const unpaid = { ...session, payment_status: 'unpaid' };
  assert.equal(getSandboxWebhookAction({ ...event, type: 'checkout.session.async_payment_failed', data: { object: unpaid } }).status, 'failed');
  assert.equal(getSandboxWebhookAction({ ...event, type: 'checkout.session.expired', data: { object: unpaid } }).status, 'expired');
  assert.equal(getSandboxWebhookAction({ ...event, type: 'checkout.session.expired', data: { object: session } }), null);
});

test('duplicate and late webhook deliveries cannot change a settled order', async () => {
  const { applySandboxWebhook } = await import('../lib/stripe-webhook-sandbox.ts');
  const order = { id: 'order123', stripeSessionId: 'cs_test_123', totalCents: 4800, currency: 'usd', status: 'pending' };
  const repository = {
    find: async () => order,
    transitionOrder: async (_id, _session, status) => { if (order.status === 'pending' || (status === 'paid' && ['failed', 'expired'].includes(order.status))) order.status = status; },
  };
  const paid = getSandboxWebhookAction(event);
  assert.equal(await applySandboxWebhook(paid, repository), 'ok');
  assert.equal(await applySandboxWebhook(paid, repository), 'ok');
  const expired = { ...paid, status: 'expired' };
  assert.equal(await applySandboxWebhook(expired, repository), 'ok');
  assert.equal(order.status, 'paid');
  order.status = 'failed';
  assert.equal(await applySandboxWebhook(paid, repository), 'ok');
  assert.equal(order.status, 'paid');
  assert.equal(await applySandboxWebhook({ ...paid, amountCents: 1 }, repository), 'mismatch');
  order.stripeSessionId = null;
  assert.equal(await applySandboxWebhook(paid, repository), 'not_ready');
});
