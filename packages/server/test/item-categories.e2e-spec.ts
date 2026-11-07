import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Item Categories(e2e)', () => {
  it('/item-categories (POST)', () => {
    return request(app.getHttpServer())
      .post('/item-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
      })
      .expect(201);
  });

  it('/item-categories (POST) with a FIFO cost method', async () => {
    const response = await request(app.getHttpServer())
      .post('/item-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
        costMethod: 'FIFO',
      })
      .expect(201);

    expect(response.body.cost_method).toBe('FIFO');

    const getResponse = await request(app.getHttpServer())
      .get(`/item-categories/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(getResponse.body.cost_method).toBe('FIFO');
  });

  it('/item-categories (POST) without a cost method inherits the preference', async () => {
    const response = await request(app.getHttpServer())
      .post('/item-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: `${faker.person.fullName()} ${faker.string.alphanumeric(8)}`,
        description: faker.lorem.sentence(),
      })
      .expect(201);

    expect(response.body.cost_method).toBeNull();

    const getResponse = await request(app.getHttpServer())
      .get(`/item-categories/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(getResponse.body.cost_method).toBeNull();
  });

  it('/item-categories (PUT) can clear the cost method to inherit', async () => {
    const response = await request(app.getHttpServer())
      .post('/item-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: `${faker.person.fullName()} ${faker.string.alphanumeric(8)}`,
        description: faker.lorem.sentence(),
        costMethod: 'FIFO',
      })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/item-categories/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: response.body.name,
        description: response.body.description,
        costMethod: null,
      })
      .expect(200);

    const getResponse = await request(app.getHttpServer())
      .get(`/item-categories/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(getResponse.body.cost_method).toBeNull();
  });

  it('/item-categories (POST) rejects an invalid cost method', () => {
    return request(app.getHttpServer())
      .post('/item-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
        costMethod: 'INVALID',
      })
      .expect(400);
  });

  it('/item-categories/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/item-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
      });
    const itemCategoryId = response.body.id;

    return request(app.getHttpServer())
      .get(`/item-categories/${itemCategoryId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/item-categories/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/item-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.person.fullName(),
        description: faker.lorem.sentence(),
      });

    const itemCategoryId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/item-categories/${itemCategoryId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
