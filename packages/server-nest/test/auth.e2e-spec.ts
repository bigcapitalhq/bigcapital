import * as request from 'supertest';

import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

describe('Authentication (e2e)', () => {
  beforeAll(async () => {});

  it('should signup success', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: '123123123',
      })
      .expect(201);
  });

  it('should signin success', () => {
    const signupBody = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: '123123123',
    };
    const response = request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupBody);

    request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: signupBody.email,
        password: signupBody.password,
      })
      .expect(201);
  });

  it('should send reset password success', () => {
    const signupBody = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: '123123123',
    };
    const signupResponse = request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupBody);

    request(app.getHttpServer())
      .post('/auth/send_reset_password')
      .send({
        email: signupBody.email,
      })
      .expect(201);
  });
});
