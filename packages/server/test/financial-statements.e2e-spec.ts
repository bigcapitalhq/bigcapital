import * as request from 'supertest';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

describe('Financial Statements (e2e)', () => {
  const baseQuery = {
    fromDate: '2023-01-01',
    toDate: '2023-12-31',
  };

  it('/reports/balance-sheet (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/balance-sheet')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/profit-loss-sheet (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/profit-loss-sheet')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/trial-balance-sheet (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/trial-balance-sheet')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/general-ledger (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/general-ledger')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/journal (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/journal')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/cashflow-statement (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/cashflow-statement')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/receivable-aging-summary (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/receivable-aging-summary')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/payable-aging-summary (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/payable-aging-summary')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/customer-balance-summary (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/customer-balance-summary')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/vendor-balance-summary (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/vendor-balance-summary')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/sales-by-items (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/sales-by-items')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/purchases-by-items (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/purchases-by-items')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/inventory-valuation (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/inventory-valuation')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/inventory-item-details (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/inventory-item-details')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/sales-tax-liability-summary (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/sales-tax-liability-summary')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/transactions-by-customers (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/transactions-by-customers')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/transactions-by-vendors (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/transactions-by-vendors')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/reports/transactions-by-reference (GET)', () => {
    return request(app.getHttpServer())
      .get('/reports/transactions-by-reference')
      .query(baseQuery)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
