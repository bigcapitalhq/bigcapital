import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const requestBankRule = () => ({
  name: faker.company.name(),
  order: 1,
  applyIfAccountId: 1001,
  applyIfTransactionType: 'deposit',
  conditions: [
    {
      field: 'description',
      comparator: 'contains',
      value: faker.finance.transactionDescription(),
    },
  ],
  assignCategory: 'Deposit',
  assignAccountId: 1002,
  assignPayee: faker.company.name(),
  assignMemo: faker.lorem.sentence(),
});

describe('Bank Rules (e2e)', () => {
  it('/banking/rules (POST)', () => {
    return request(app.getHttpServer())
      .post('/banking/rules')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestBankRule())
      .expect(201);
  });

  it('/banking/rules/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/banking/rules')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestBankRule());

    const ruleId = response.body.id;

    return request(app.getHttpServer())
      .put(`/banking/rules/${ruleId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestBankRule())
      .expect(200);
  });

  it('/banking/rules/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/banking/rules')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestBankRule());

    const ruleId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/banking/rules/${ruleId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/rules/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/banking/rules')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestBankRule());

    const ruleId = response.body.id;

    return request(app.getHttpServer())
      .get(`/banking/rules/${ruleId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/rules (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/banking/rules')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestBankRule());

    const ruleId = response.body.id;

    return request(app.getHttpServer())
      .get(`/banking/rules/${ruleId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
