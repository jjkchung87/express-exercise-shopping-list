process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('../app');
let items = require('../fakeDb');


let coffee = { name: 'coffee', price: 5.99 };

beforeEach(function () {
  items.push(coffee);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});

describe('GET /items', () => {
  test('Get all items', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [{ name: 'coffee', price: 5.99 }] })
  })
})

describe('GET /items/:name', () => {
  test('Get item by name', async () => {
    const res = await request(app).get(`/items/${coffee.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: { name: 'coffee', price: 5.99 } })
  })
  test('Responds with 404 for invalid item', async () => {
    const res = await request(app).get(`/items/icecube`);
    expect(res.statusCode).toBe(404)
  })
})

describe('POST /items', () => {
  test('Creating a item', async () => {
    const res = await request(app).post('/items').send({ name: 'milk', price: 4.99  });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: 'milk', price: 4.99} });
  })
  test('Responds with 400 if name is missing', async () => {
    const res = await request(app).post('/items').send({});
    expect(res.statusCode).toBe(400);
  })
})

describe('/PATCH /items/:name', () => {
  test('Updating a items name', async () => {
    const res = await request(app).patch(`/items/${coffee.name}`).send({ name: 'decaf', price: 5.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: 'decaf', price: 5.99 } });
  })
  test('Responds with 404 for invalid name', async () => {
    const res = await request(app).patch(`/items/Piggles`).send({ name: 'decaf', price: 5.99 });
    expect(res.statusCode).toBe(404);
  })
})

describe('/DELETE /items/:name', () => {
  test('Deleting a item', async () => {
    const res = await request(app).delete(`/items/${coffee.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test('Responds with 404 for deleting invalid item', async () => {
    const res = await request(app).delete(`/items/hamface`);
    expect(res.statusCode).toBe(404);
  })
})