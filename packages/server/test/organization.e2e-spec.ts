import request = require('supertest');
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
      password: '1231231230',
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

  const authHeaders = () => ({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${signinResponse.body.access_token}`,
    'organization-id': signupResponse.body.organization_id,
  });

  // The webapp / `@bigcapital/sdk-ts` serialize request bodies to snake_case,
  // so the e2e payloads below intentionally use snake_case keys.
  it('/organization/build (POST) persists the snake_case setup payload', async () => {
    await request(app.getHttpServer())
      .post('/organization/build')
      .set(authHeaders())
      .send({
        name: 'BIGCAPITAL, INC',
        base_currency: 'USD',
        location: 'US',
        language: 'en',
        fiscal_year: 'march',
        timezone: 'US/Central',
      })
      .expect(200);

    const { body } = await request(app.getHttpServer())
      .get('/organization/current')
      .set(authHeaders())
      .expect(200);

    expect(body.metadata).toMatchObject({
      name: 'BIGCAPITAL, INC',
      base_currency: 'USD',
      fiscal_year: 'march',
      timezone: 'US/Central',
    });
  });

  it('/organization/current (GET)', () => {
    return request(app.getHttpServer())
      .get('/organization/current')
      .set(authHeaders())
      .send()
      .expect(200);
  });

  it('/organization (PUT) persists snake_case branding + general fields', async () => {
    await request(app.getHttpServer())
      .put('/organization')
      .set(authHeaders())
      .send({
        name: 'BIGCAPITAL RENAMED, INC',
        fiscal_year: 'january',
        primary_color: '#c2b942',
        tax_number: '92-1234567',
        address: { city: 'Homer', state_province: 'AK', postal_code: '99603' },
      })
      .expect(200);

    const { body } = await request(app.getHttpServer())
      .get('/organization/current')
      .set(authHeaders())
      .expect(200);

    expect(body.metadata).toMatchObject({
      name: 'BIGCAPITAL RENAMED, INC',
      fiscal_year: 'january',
      primary_color: '#c2b942',
      tax_number: '92-1234567',
    });
    expect(body.metadata.address).toMatchObject({
      city: 'Homer',
      state_province: 'AK',
      postal_code: '99603',
    });
  });
});
