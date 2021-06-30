import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'user',
        passwordHash: 'password',
        profilePhotoUrl: 'photourl.com'
      });

    expect(res.body).toEqual({
      id: '1',
      username: 'user'
    });
  });
});
