import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const createRoleRequest = () => ({
  roleName: faker.string.alphanumeric(10),
  roleDescription: faker.lorem.sentence(),
  permissions: [
    {
      subject: 'items',
      ability: 'read',
      value: true,
    },
    {
      subject: 'items',
      ability: 'create',
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
      .expect(200);
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

  it('/roles/:id (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/roles')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createRoleRequest());
    const roleId = response.body.data.id;

    return request(app.getHttpServer())
      .post(`/roles/${roleId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        roleName: faker.string.alphanumeric(10),
        roleDescription: faker.lorem.sentence(),
        permissions: [
          {
            permissionId: 1,
            subject: 'items',
            ability: 'read',
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
    const roleId = response.body.data.roleId;

    return request(app.getHttpServer())
      .delete(`/roles/${roleId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
