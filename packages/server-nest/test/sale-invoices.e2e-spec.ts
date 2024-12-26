import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

describe('Sale Invoices (e2e)', () => {
  it('/sale-invoices (POST)', () => {
    return request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send({
        customerId: 2,
        invoiceDate: '2023-01-01',
        dueDate: '2023-02-01',
        invoiceNo: 'INV-002005',
        referenceNo: 'REF-000201',
        delivered: true,
        discountType: 'percentage',
        discount: 10,
        branchId: 1,
        warehouseId: 1,
        entries: [
          {
            index: 1,
            itemId: 1001,
            quantity: 2,
            rate: 1000,
            description: 'Item description...',
          },
        ],
      })
      .expect(201);
  });
});
