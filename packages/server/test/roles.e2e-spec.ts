import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const createRoleRequest = () => ({
  roleName: faker.string.alphanumeric(10),
  roleDescription: faker.lorem.sentence(),
  permissions: [
    {
      subject: 'Item',
      ability: 'View',
      value: true,
    },
    {
      subject: 'Item',
      ability: 'Create',
      value: true,
    },
  ],
});

describe('Roles (e2e)', () => {
  it('/roles (POST)', () => {
    console.log(createRoleRequest())
    return request(app.getHttpServer())
      .post('/roles')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createRoleRequest())
      .expect(201);
  });

  it('/roles (GET)', () => {
    return request(app.getHttpServer())
      .get('/roles')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/roles/permissions/schema (GET)', () => {
    return request(app.getHttpServer())
      .get('/roles/permissions/schema')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/roles/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/roles')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createRoleRequest());
    const roleId = response.body.data.id;

    return request(app.getHttpServer())
      .get(`/roles/${roleId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/roles/:id (PUT)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/roles')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createRoleRequest());
    const roleId = createResponse.body.data.id;

    return request(app.getHttpServer())
      .put(`/roles/${roleId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        roleName: faker.string.alphanumeric(10),
        roleDescription: faker.lorem.sentence(),
        permissions: [
          {
            subject: 'Item',
            ability: 'View',
            value: true,
          },
        ],
      })
      .expect(200);
  });

  it('/roles/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/roles')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createRoleRequest());
    const roleId = response.body.data.id;

    return request(app.getHttpServer())
      .delete(`/roles/${roleId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
