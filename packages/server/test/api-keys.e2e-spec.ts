import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('API Keys (e2e)', () => {
  it('/api-keys (GET)', () => {
    return request(app.getHttpServer())
      .get('/api-keys')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/api-keys/generate (POST)', () => {
    return request(app.getHttpServer())
      .post('/api-keys/generate')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.string.alphanumeric(10),
      })
      .expect(201);
  });
});
