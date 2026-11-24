'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'uji-rahasia';
const authMiddleware = require('../middleware/authMiddleware');

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

test('menolak permintaan tanpa token Bearer', () => {
  const response = createResponse();
  let nextCalled = false;

  authMiddleware({ headers: {} }, response, () => {
    nextCalled = true;
  });

  assert.equal(response.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('menolak token yang tidak valid', () => {
  const response = createResponse();
  let nextCalled = false;

  authMiddleware({
    headers: { authorization: 'Bearer token-salah' }
  }, response, () => {
    nextCalled = true;
  });

  assert.equal(response.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('meneruskan klaim token yang valid ke permintaan', () => {
  const token = jwt.sign({ id: 7, email: 'uji@example.com' }, process.env.JWT_SECRET);
  const request = {
    headers: { authorization: `Bearer ${token}` }
  };
  const response = createResponse();
  let nextCalled = false;

  authMiddleware(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual({
    id: request.user.id,
    email: request.user.email
  }, {
    id: 7,
    email: 'uji@example.com'
  });
  assert.equal(typeof request.user.iat, 'number');
});
