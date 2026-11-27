import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Item Categories(e2e)', () => {
  it('/tax-rates (POST)', () => {
    return request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.person.fullName(),
        rate: 2,
        code: faker.string.uuid(),
        active: true,
      })
      .expect(201);
  });

  it('/tax-rates (POST) keeps a rate with more than two decimals', async () => {
    const response = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.person.fullName(),
        rate: 9.975,
        code: faker.string.uuid(),
        active: true,
      })
      .expect(201);

    const taxRate = await request(app.getHttpServer())
      .get(`/tax-rates/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(taxRate.body.rate).toBe(9.975);
    expect(taxRate.body.rate_formatted).toBe('9.975%');
  });

  it('/tax-rates/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.person.fullName(),
        rate: 2,
        code: faker.string.uuid(),
        active: true,
      });
    const taxRateId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/tax-rates/${taxRateId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
