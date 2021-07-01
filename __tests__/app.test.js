import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserService.js';
import Post from '../lib/models/Post.js';
import Comment from '../lib/models/Comment.js';

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
    agent = request.agent(app);
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
    const res = await agent
      .post('/api/v1/posts')
      .send({
        userId: user.id,
        photoUrl: 'blah',
        caption: 'Look at this cool post!',
        tags: ['cool', 'amaz-ing', 'awesome']
      });

    expect(res.body).toEqual({
      id: '1',
      userId: user.id,
      photoUrl: 'blah',
      caption: 'Look at this cool post!',
      tags: ['cool', 'amaz-ing', 'awesome']
    });
  });

  it('gets all posts via GET', async () => {
    const post1 = await Post.insert({
      userId: user.id,
      photoUrl: 'blah',
      caption: 'Look at this cool post!',
      tags: ['cool', 'amaz-ing', 'awesome']

    });
    const post2 = await Post.insert({
      userId: user.id,
      photoUrl: 'boom',
      caption: 'Look at this terrible post!',
      tags: ['sucks', 'boooo']

    });

    const res = await agent
      .get('/api/v1/posts');

    expect(res.body).toEqual([post1, post2]);
      
  });

  it('gets a post by id via GET', async () => {
    const post1 = await Post.insert({
      userId: user.id,
      photoUrl: 'blah',
      caption: 'Look at this cool post!',
      tags: ['cool', 'amaz-ing', 'awesome']
    });

    const res = await agent
      .get(`/api/v1/posts/${user.id}`);

    expect(res.body).toEqual(post1);
  });

  it('updates a post via PATCH', async () => {
    const post = await Post.insert({
      userId: user.id,
      photoUrl: 'blah',
      caption: 'Look at this cool post!',
      tags: ['cool', 'amaz-ing', 'awesome']
    });

    post.caption = 'Winning.';

    const res = await agent
      .patch(`/api/v1/posts/${post.id}`)
      .send({ caption: 'Winning.' });

    expect(res.body).toEqual(post);
  });

  it('deletes a post by id via DELETE', async () => {
    const post = await Post.insert({
      userId: user.id,
      photoUrl: 'blah',
      caption: 'Look at this cool post!',
      tags: ['cool', 'amaz-ing', 'awesome']
    });

    const res = await agent
      .delete(`/api/v1/posts/${post.id}`)
      .send(post);

    expect(res.body).toEqual(post);
  });

  // it('gets most popular posts via GET', async () => {

  // })
  
});

describe('Comment routes', () => {

  let user = {};
  
  let agent;

  beforeEach(async() => {
    await setup(pool);
    agent = request.agent(app);
    user = await UserService.create({
      username: 'datboi456',
      password: 'wordpass',
      profilePhotoUrl: 'me.jpg'
    });
    await agent.post('/api/v1/auth/login')
      .send({
        username: 'datboi456',
        password: 'wordpass',
      });
  });

  it('creates a comment via POST', async () => {
    
    const post = await Post.insert({
      userId: user.id,
      photoUrl: 'blah',
      caption: 'Look at this cool post!',
      tags: ['cool', 'amaz-ing', 'awesome']

    });

    const res = await agent
      .post('/api/v1/comments')
      .send({
        commentBy: user.id,
        post: post.id,
        comment: 'Looks uber cool'
      });

    expect(res.body).toEqual({
      id: '1',
      commentBy: user.id,
      post: post.id,
      comment: 'Looks uber cool'
    });
  });

  it('deletes a comment by id via DELETE', async () => {
    const post = await Post.insert({
      userId: user.id,
      photoUrl: 'blah',
      caption: 'Look at this cool post!',
      tags: ['cool', 'amaz-ing', 'awesome']

    });

    const comment = await Comment.insert({
      commentBy: user.id,
      post: post.id,
      comment: 'Looks uber cool'
    });

    const res = await agent
      .delete(`/api/v1/comments/${comment.id}`)
      .send(comment);

    expect(res.body).toEqual(comment);


  });
  
});


