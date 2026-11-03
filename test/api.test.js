const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/index');

let server;
let base;
test.before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(async () => {
  if (server) await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
});

async function post(route, payload, origin) {
  const headers = { 'content-type': 'application/json' };
  if (origin) headers.origin = origin;
  const response = await fetch(base + route, {
    method: 'POST', headers, body: JSON.stringify(payload)
  });
  return { status: response.status, body: await response.json(), headers: response.headers };
}

test('all arithmetic endpoints return numeric results', async () => {
  for (const [route, expected] of [
    ['/sumar', 5], ['/resta', -1], ['/multiplicar', 6], ['/dividir', 2 / 3]
  ]) {
    const result = await post(route, { num1: 2, num2: 3 });
    assert.equal(result.status, 200);
    assert.equal(result.body.resultado, expected);
  }
});
test('zero is a valid operand', async () => {
  const result = await post('/sumar', { num1: 0, num2: 3 });
  assert.equal(result.status, 200);
  assert.equal(result.body.resultado, 3);
});
test('string inputs are rejected instead of concatenated', async () => {
  const result = await post('/sumar', { num1: '2', num2: '3' });
  assert.equal(result.status, 400);
});
test('invalid inputs are rejected', async () => {
  for (const body of [{ num1: null, num2: 2 }, { num1: true, num2: 2 }, { num1: 1 }, [], null]) {
    const result = await post('/sumar', body);
    assert.equal(result.status, 400);
  }
});
test('division by zero is rejected', async () => {
  const result = await post('/dividir', { num1: 10, num2: 0 });
  assert.equal(result.status, 400);
});
test('overflow is rejected', async () => {
  const result = await post('/multiplicar', { num1: 1e308, num2: 1e308 });
  assert.equal(result.status, 422);
});
test('unlisted browser origin receives no CORS permission', async () => {
  const result = await post('/sumar', { num1: 1, num2: 2 }, 'https://untrusted.example');
  assert.equal(result.headers.get('access-control-allow-origin'), null);
});
test('server omits X-Powered-By', async () => {
  const response = await fetch(base);
  assert.equal(response.headers.get('x-powered-by'), null);
});
