import request = require('supertest');
import { faker } from '@faker-js/faker';
import {
  app,
  AuthorizationHeader,
  authenticatedUserId,
  orgainzationId,
} from './init-app-test';

let userId;

describe('Users (e2e)', () => {
  beforeAll(async () => {
    const usersResponse = await request(app.getHttpServer())
      .get('/users')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    if (usersResponse.body.length > 0) {
      userId = usersResponse.body[0].id;
    }
  });

  /**
   * Retrieves the tenant user id of the currently authenticated user by
   * matching the `system_user_id` of the users list against the system user
   * id returned by the sign-in response.
   * @returns {Promise<number | undefined>}
   */
  const getAuthenticatedUserTenantId = async () => {
    const usersResponse = await request(app.getHttpServer())
      .get('/users')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    const currentUser = usersResponse.body.find(
      (user) => user.system_user_id === authenticatedUserId,
    );

    return currentUser?.id;
  };

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/users/:id (GET)', async () => {
    if (!userId) {
      const usersResponse = await request(app.getHttpServer())
        .get('/users')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader);

      if (usersResponse.body.length > 0) {
        userId = usersResponse.body[0].id;
      }
    }

    if (userId) {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);
    }
  });

  it('/users/:id (PUT)', async () => {
    if (!userId) {
      const usersResponse = await request(app.getHttpServer())
        .get('/users')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader);

      if (usersResponse.body.length > 0) {
        userId = usersResponse.body[0].id;
      }
    }
    if (userId) {
      const userResponse = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader);

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: userResponse.body.email,
          roleId: userResponse.body.role_id,
        })
        .expect(200);
    }
  });

  it('/users/:id/activate (PUT) - cannot activate the current user', async () => {
    const currentUserTenantId = await getAuthenticatedUserTenantId();
    expect(currentUserTenantId).toBeDefined();

    return request(app.getHttpServer())
      .put(`/users/${currentUserTenantId}/activate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].type).toBe('USER_SAME_THE_AUTHORIZED_USER');
      });
  });

  it('/users/:id/inactivate (PUT) - cannot inactivate the current user', async () => {
    const currentUserTenantId = await getAuthenticatedUserTenantId();
    expect(currentUserTenantId).toBeDefined();

    return request(app.getHttpServer())
      .put(`/users/${currentUserTenantId}/inactivate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(400)
      .expect((res) => {
        expect(res.body.errors[0].type).toBe('USER_SAME_THE_AUTHORIZED_USER');
      });
  });
});
