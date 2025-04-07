import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Branches (e2e)', () => {
  it('/branches (POST)', () => {
    return request(app.getHttpServer())
      .post('/branches')
      .set('organization-id', orgainzationId)
      .send({
        name: faker.commerce.productName(),
        code: faker.string.alpha(4),
      })
      .expect(201);
  });

  it('/branches/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/branches')
      .set('organization-id', orgainzationId)
      .send({
        name: faker.commerce.productName(),
        code: faker.string.alpha(4),
      });
    const branchId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/branches/${branchId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/branches/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/branches')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.commerce.productName(),
        code: faker.string.alpha(4),
      });
    const branchId = response.body.id;

    return request(app.getHttpServer())
      .put(`/branches/${branchId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/branches/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/branches')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.commerce.productName(),
        code: faker.string.alpha(4),
      });
    const branchId = response.body.id;

    return request(app.getHttpServer())
      .get(`/branches/${branchId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/branches (GET)', async () => {
    return request(app.getHttpServer())
      .get('/branches')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
