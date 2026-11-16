import request = require('supertest');
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

  it('/invite (PATCH) re-invites a pending user instead of failing', async () => {
    const email = faker.internet.email();

    await request(app.getHttpServer())
      .patch('/invite')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ email, roleId: 1 })
      .expect(200);

    // Inviting the same (still unaccepted) email again should resend the
    // invite rather than fail with an email-exists error.
    await request(app.getHttpServer())
      .patch('/invite')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ email, roleId: 1 })
      .expect(200);
  });
});
