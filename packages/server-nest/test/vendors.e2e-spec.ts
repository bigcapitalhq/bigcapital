import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

describe('Vendors (e2e)', () => {
  it('/vendors (POST)', () => {
    return request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', '4064541lv40nhca')
      .send({
        displayName: faker.commerce.productName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      })
      .expect(201);
  });

  it('/vendors/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', '4064541lv40nhca')
      .send({
        displayName: faker.commerce.productName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      });
    const vendorId = response.body.id;

    return request(app.getHttpServer())
      .put(`/vendors/${vendorId}`)
      .set('organization-id', '4064541lv40nhca')
      .send({
        displayName: faker.commerce.productName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      })
      .expect(200);
  });

  it('/vendors/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', '4064541lv40nhca')
      .send({
        displayName: faker.commerce.productName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      });
    const vendorId = response.body.id;

    return request(app.getHttpServer())
      .get(`/vendors/${vendorId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/vendors/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', '4064541lv40nhca')
      .send({
        displayName: faker.commerce.productName(),
      });
    const vendorId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/vendors/${vendorId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
