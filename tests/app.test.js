const request = require('supertest');
const app = require('../app');

describe('App (from app.js)', () => {
  it('should have a default route (/)', (done) => {
    request(app)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBeGreaterThanOrEqual(200);
        expect(response.statusCode).toBeLessThan(400);
        done();
      });
  });
});
