import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import {
  app,
  authenticationToken,
  AuthorizationHeader,
  orgainzationId,
} from './init-app-test';

const makeItemRequest = () => ({
  name: faker.commerce.productName(),
  type: 'service',
});

describe.only('Items (e2e)', () => {
  it('/items (POST)', () => {
    return request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest())
      .expect(201);
  });

  it('/items/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());

    const itemId = response.body.id;

    return request(app.getHttpServer())
      .put(`/items/${itemId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest())
      .expect(200);
  });

  it('/items (GET)', () => {
    return request(app.getHttpServer())
      .get('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .get(`/items/${itemId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/inactivate (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .patch(`/items/${itemId}/inactivate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/activate (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...makeItemRequest(),
        active: false,
      });
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .patch(`/items/${itemId}/activate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/items/${itemId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/invoices (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .get(`/items/${itemId}/invoices`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/bills (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .get(`/items/${itemId}/bills`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/estimates (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .get(`/items/${itemId}/estimates`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/receipts (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .get(`/items/${itemId}/receipts`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/validate-bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId2 = response2.body.id;

    return request(app.getHttpServer())
      .post('/items/validate-bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [itemId1, itemId2],
      })
      .expect(200);
  });

  it('/items/bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId2 = response2.body.id;

    return request(app.getHttpServer())
      .post('/items/bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [itemId1, itemId2],
      })
      .expect(200);
  });
});
