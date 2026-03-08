require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const request = require('supertest');
const app = require('../../src/app');

describe('Auth Routes', () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    password: 'testpassword123'
  };

  test('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/auth/register - should fail with duplicate username', async () => {
    await request(app).post('/api/auth/register').send(testUser);
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/login - should login with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: testUser.username, password: 'wrongpassword' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/login - should fail with non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nonexistent_xyz', password: 'password' });
    expect(res.statusCode).toBe(400);
  });
});