import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const createCurrencyRequest = () => ({
  currencyName: faker.finance.currencyName(),
  currencyCode: faker.string.alpha({ length: 3 }).toUpperCase(),
  currencySign: faker.finance.currencySymbol(),
});

describe('Currencies (e2e)', () => {
  it('/currencies (POST)', () => {
    return request(app.getHttpServer())
      .post('/currencies')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createCurrencyRequest())
      .expect(201);
  });

  it('/currencies (GET)', () => {
    return request(app.getHttpServer())
      .get('/currencies')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/currencies/:currencyCode (GET)', async () => {
    const currency = createCurrencyRequest();
    await request(app.getHttpServer())
      .post('/currencies')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(currency);

    return request(app.getHttpServer())
      .get(`/currencies/${currency.currencyCode}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/currencies/:id (PUT)', async () => {
    const currency = createCurrencyRequest();
    const response = await request(app.getHttpServer())
      .post('/currencies')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(currency);
    const currencyId = response.body.id;

    return request(app.getHttpServer())
      .put(`/currencies/${currencyId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        currencyName: faker.finance.currencyName(),
        currencyCode: currency.currencyCode,
        currencySign: faker.finance.currencySymbol(),
      })
      .expect(200);
  });

  it('/currencies/:code (DELETE)', async () => {
    const currency = createCurrencyRequest();
    await request(app.getHttpServer())
      .post('/currencies')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(currency);

    return request(app.getHttpServer())
      .delete(`/currencies/${currency.currencyCode}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
