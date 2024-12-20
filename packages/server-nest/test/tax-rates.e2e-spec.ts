import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

describe('Item Categories(e2e)', () => {
  it('/tax-rates (POST)', () => {
    return request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', '4064541lv40nhca')
      .send({
        name: faker.person.fullName(),
        rate: 2,
        code: faker.string.uuid(),
        active: 1,
      })
      .expect(201);
  });

  it('/tax-rates/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', '4064541lv40nhca')
      .send({
        name: faker.person.fullName(),
        rate: 2,
        code: faker.string.uuid(),
        active: 1,
      });
    const taxRateId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/tax-rates/${taxRateId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
