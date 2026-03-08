require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const request = require('supertest');
const app = require('../../src/app');

let token;
let adminToken;
let itemId;

beforeAll(async () => {
  const username = `itemtestuser_${Date.now()}`;
  await request(app).post('/api/auth/register').send({ username, password: 'password123' });
  const res = await request(app).post('/api/auth/login').send({ username, password: 'password123' });
  token = res.body.token;

  const adminRes = await request(app).post('/api/auth/login').send({ username: 'vikna', password: '123456' });
  adminToken = adminRes.body.token;
}, 15000);

describe('Items Routes', () => {
  test('GET /api/items - should return approved items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/items - should submit item when authenticated', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Sword', category: 'weapon', description: 'A test weapon', image: null });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    itemId = res.body.id;
  });

  test('POST /api/items - should fail without auth', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Test Sword', category: 'weapon', description: 'A test weapon' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/items/pending - should return pending items for admin', async () => {
    const res = await request(app)
      .get('/api/items/pending')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/items/pending - should fail for regular user', async () => {
    const res = await request(app)
      .get('/api/items/pending')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  test('PUT /api/items/approve/:id - should approve item as admin', async () => {
    const res = await request(app)
      .put(`/api/items/approve/${itemId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/items/category/:cat - should return items by category', async () => {
    const res = await request(app).get('/api/items/category/weapon');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('DELETE /api/items/:id - should delete item as admin', async () => {
    const res = await request(app)
      .delete(`/api/items/${itemId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
