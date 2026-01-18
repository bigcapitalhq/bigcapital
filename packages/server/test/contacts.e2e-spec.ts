import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let customerId;
let vendorId;

describe('Contacts (e2e)', () => {
  beforeAll(async () => {
    const customer = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ displayName: 'Test Customer' });

    customerId = customer.body.id;

    const vendor = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ displayName: 'Test Vendor' });

    vendorId = vendor.body.id;
  });

  it('/contacts/auto-complete (GET)', () => {
    return request(app.getHttpServer())
      .get('/contacts/auto-complete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/contacts/:id/activate (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/contacts/${customerId}/activate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/contacts/:id/inactivate (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/contacts/${vendorId}/inactivate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
