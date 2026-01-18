import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import {
  app,
  AuthorizationHeader,
  orgainzationId,
} from './init-app-test';

const makeAccountRequest = () => ({
  name: `${faker.finance.accountName()} ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
  accountType: 'cash',
  code: faker.string.alphanumeric({ length: 6 }).toUpperCase(),
});

describe.only('Accounts (e2e)', () => {
  it('/accounts (POST)', () => {
    return request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeAccountRequest())
      .expect(201);
  });

  it('/accounts (GET)', () => {
    return request(app.getHttpServer())
      .get('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/accounts/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeAccountRequest())
      .expect(201);

    const accountId = response.body.id;

    return request(app.getHttpServer())
      .get(`/accounts/${accountId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/accounts/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeAccountRequest())
      .expect(201);
    const accountId = response.body.id;

    return request(app.getHttpServer())
      .put(`/accounts/${accountId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeAccountRequest())
      .expect(200);
  });

  it('/accounts/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeAccountRequest())
      .expect(201);
    const accountId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/accounts/${accountId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/accounts/:id/activate (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...makeAccountRequest(),
        active: false,
      })
      .expect(201);
    const accountId = response.body.id;

    return request(app.getHttpServer())
      .post(`/accounts/${accountId}/activate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/accounts/:id/inactivate (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...makeAccountRequest(),
        active: true,
      })
      .expect(201);
    const accountId = response.body.id;

    return request(app.getHttpServer())
      .post(`/accounts/${accountId}/inactivate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/accounts/types (GET)', () => {
    return request(app.getHttpServer())
      .get('/accounts/types')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/accounts/validate-bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeAccountRequest())
      .expect(201);
    const accountId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeAccountRequest())
      .expect(201);
    const accountId2 = response2.body.id;

    return request(app.getHttpServer())
      .post('/accounts/validate-bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [accountId1, accountId2],
      })
      .expect(200);
  });

  it('/accounts/bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeAccountRequest())
      .expect(201);
    const accountId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeAccountRequest())
      .expect(201);
    const accountId2 = response2.body.id;

    return request(app.getHttpServer())
      .post('/accounts/bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [accountId1, accountId2],
      })
      .expect(200);
  });
});
