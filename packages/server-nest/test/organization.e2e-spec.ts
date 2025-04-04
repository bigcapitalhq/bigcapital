import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

let signinResponse = null;
let signupResponse = null;

describe('Organization (e2e)', () => {
  beforeAll(async () => {
    const signupBody = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: '123123123',
    };
    signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupBody);

    signinResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: signupBody.email,
        password: signupBody.password,
      });
  });

  it('/organization (POST)', async () => {    
    return request(app.getHttpServer())
      .post('/organization/build')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${signinResponse.body.access_token}`)
      .set('organization-id', signupResponse.body.organization_id)
      .send({
        name: 'BIGCAPITAL, INC',
        baseCurrency: 'USD',
        location: 'US',
        language: 'en',
        fiscalYear: 'march',
        timezone: 'US/Central',
      })
      .expect(200);
  });

  it('/organization (GET)', () => {
    return request(app.getHttpServer())
    .get('/organization/current')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${signinResponse.body.access_token}`)
    .set('organization-id', signupResponse.body.organization_id)
    .send()
    .expect(200);
  });

  it('/organization (PUT)', () => {
    return request(app.getHttpServer())
      .put('/organization')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${signinResponse.body.access_token}`)
      .set('organization-id', signupResponse.body.organization_id)
      .send({
        name: 'BIGCAPITAL, INC',
        baseCurrency: 'USD',
        location: 'US',
        language: 'en',
        fiscalYear: 'march',
        timezone: 'US/Central',
      })
      .expect(200);
  });
});
