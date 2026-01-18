import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Banking Accounts (e2e)', () => {
  it('/banking/accounts (GET)', () => {
    return request(app.getHttpServer())
      .get('/banking/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/banking/accounts/:bankAccountId/summary (GET)', async () => {
    // First, get the list of bank accounts
    const accountsResponse = await request(app.getHttpServer())
      .get('/banking/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    let bankAccountId: number;

    // If there are no bank accounts, create one
    if (accountsResponse.body.length === 0) {
      const createResponse = await request(app.getHttpServer())
        .post('/accounts')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send({
          name: `${faker.finance.accountName()} ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
          accountType: 'bank',
          code: faker.string.alphanumeric({ length: 6 }).toUpperCase(),
        })
        .expect(201);

      bankAccountId = createResponse.body.id;
    } else {
      // Use the first bank account's ID
      bankAccountId = accountsResponse.body[0].id;
    }

    return request(app.getHttpServer())
      .get(`/banking/accounts/${bankAccountId}/summary`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
