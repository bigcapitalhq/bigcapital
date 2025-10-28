import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Warehouses (e2e)', () => {
  it('/warehouses (POST)', () => {
    return request(app.getHttpServer())
      .post('/warehouses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.commerce.productName(),
        code: faker.string.alpha(4),
      })
      .expect(201);
  });

  it('/warehouses/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/warehouses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.commerce.productName(),
        code: faker.string.alpha(4),
      });
    const warehouseId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/warehouses/${warehouseId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/warehouses/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/warehouses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.commerce.productName(),
        code: faker.string.alpha(4),
      });
    const warehouseId = response.body.id;

    return request(app.getHttpServer())
      .put(`/warehouses/${warehouseId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/warehouses/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/warehouses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.commerce.productName(),
        code: faker.string.alpha(4),
      });
    const warehouseId = response.body.id;

    return request(app.getHttpServer())
      .get(`/warehouses/${warehouseId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/warehouses (GET)', async () => {
    return request(app.getHttpServer())
      .get('/warehouses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
