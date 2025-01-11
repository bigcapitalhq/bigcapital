import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, orgainzationId } from './init-app-test';

describe('Customers (e2e)', () => {
  it('/customers (POST)', () => {
    return request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .send({
        customerType: 'business',
        displayName: faker.commerce.productName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      })
      .expect(201);
  });

  it('/customers/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .send({
        customerType: 'business',
        displayName: faker.commerce.productName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      });
    const customerId = response.body.id;

    return request(app.getHttpServer())
      .get(`/customers/${customerId}`)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/customers/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .send({
        customerType: 'business',
        displayName: faker.commerce.productName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      });
    const customerId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/customers/${customerId}`)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/customers/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .send({
        customerType: 'business',
        displayName: faker.commerce.productName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      });
    const customerId = response.body.id;

    return request(app.getHttpServer())
      .put(`/customers/${customerId}`)
      .set('organization-id', orgainzationId)
      .send({
        displayName: faker.commerce.productName(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      })
      .expect(200);
  });
});
