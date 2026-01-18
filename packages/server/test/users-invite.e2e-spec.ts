import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Users Invite (e2e)', () => {
  it('/invite (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/invite')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        email: faker.internet.email(),
        roleId: 1,
      })
      .expect(200);
  });
});
