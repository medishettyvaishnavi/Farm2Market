import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';

test('API health and protected buyer routes', async () => {
  const server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  try {
    const health = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { ok: true });
    const protectedResponse = await fetch(`http://127.0.0.1:${port}/api/demands`);
    assert.equal(protectedResponse.status, 401);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});