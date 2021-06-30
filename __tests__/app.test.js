import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';

const agent = request.agent(app);

describe('demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('sign up a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'user',
        password: 'password',
        profilePhotoUrl: 'photourl.com'
      });

    expect(res.body).toEqual({
      id: '1',
      username: 'user',
      profilePhotoUrl: 'photourl.com'
    });
  });

  it('logs in a user via POST', async () => {
    const user = await UserService.create({
      username: 'datboi456',
      password: 'wordpass',
      profilePhotoUrl: 'me.jpg'
    });

    const res = await agent
      .post('/api/v1/auth/login')
      .send({
        username: 'datboi456',
        password: 'wordpass',
        profilePhotoUrl: 'me.jpg'
      });
    expect(res.body).toEqual({
      id: '1',
      username: user.username,
      profilePhotoUrl: 'me.jpg'
    });
  });
});

// Post Tests
describe('Post tests', () => {

  let user = {};
  let agent;

  beforeEach(async() => {
    await setup(pool);
    agent = await request.agent(app);
    user = await UserService.create({
      username: 'Ollie',
      password: 'password',
      profilePhotoUrl: 'yes'
    });
    await agent.post('/api/v1/auth/login')
      .send({
        username: 'Ollie',
        password: 'password'
      });
  });

  it('creates a post via POST', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .send({
        userId: user.id,
        photoUrl: 'blah',
        caption: 'Look at this cool post!',
        tags: ['cool', 'amaz-ing', 'awesome']
      });

    expect(res.body).toEqual({
      userId: user.id,
      photoUrl: 'blah',
      caption: 'Look at this cool post!',
      tags: ['cool', 'amaz-ing', 'awesome']
    });
  });
  
});

