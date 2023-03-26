import { tenantWebsite, tenantFactory, loginRes } from '~/dbInit';
import { request, expect } from '~/testInit';
import { SaleReceipt } from 'models';

describe('route: `/sales/receipts`', () => {
  describe('POST: `/sales/receipts`', () => {
    it('Should `deposit_account_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/receipts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'deposit_account_id',
        location: 'body',
      });
    });

    it('Should `customer_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/receipts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'customer_id',
        location: 'body',
      });
    });

    it('should `receipt_date` be required.', async () => {
      const res = await request()
        .post('/api/sales/receipts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'receipt_date',
        location: 'body',
      });
    });

    it('Should `entries.*.item_id` be required.', async () => {});

    it('Should `deposit_account_id` be exists.', async () => {
      const res = await request()
        .post('/api/sales/receipts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          deposit_account_id: 12220,
          customer_id: 1,
          receipt_date: '2020-02-02',
          reference_no: '123',
          entries: [
            {
              item_id: 1,
              quantity: 1,
              rate: 2,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'DEPOSIT.ACCOUNT.NOT.EXISTS',
        code: 300,
      });
    });

    it('Should `customer_id` be exists.', async () => {
      const res = await request()
        .post('/api/sales/receipts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          deposit_account_id: 12220,
          customer_id: 1001,
          receipt_date: '2020-02-02',
          reference_no: '123',
          entries: [
            {
              item_id: 1,
              quantity: 1,
              rate: 2,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMER.ID.NOT.EXISTS',
        code: 200,
      });
    });

    it('Should all `entries.*.item_id` be exists on the storage.', async () => {
      const res = await request()
        .post('/api/sales/receipts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          deposit_account_id: 12220,
          customer_id: 1001,
          receipt_date: '2020-02-02',
          reference_no: '123',
          entries: [
            {
              item_id: 1000,
              quantity: 1,
              rate: 2,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ITEMS.IDS.NOT.EXISTS',
        code: 400,
      });
    });

    it('Should store the sale receipt details with entries to the storage.', async () => {
      const item = await tenantFactory.create('item');
      const customer = await tenantFactory.create('customer');
      const account = await tenantFactory.create('account');

      const res = await request()
        .post('/api/sales/receipts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          deposit_account_id: account.id,
          customer_id: customer.id,
          receipt_date: '2020-02-02',
          reference_no: '123',
          receipt_message: 'Receipt message...',
          statement: 'Receipt statement...',
          entries: [
            {
              item_id: item.id,
              quantity: 1,
              rate: 2,
            },
          ],
        });

      const storedSaleReceipt = await SaleReceipt.tenant()
        .query()
        .where('id', res.body.id)
        .first();

      expect(res.status).equals(200);
      expect(storedSaleReceipt.depositAccountId).equals(account.id);
      expect(storedSaleReceipt.referenceNo).equals('123');
      expect(storedSaleReceipt.customerId).equals(customer.id);

      expect(storedSaleReceipt.receiptMessage).equals('Receipt message...');
      expect(storedSaleReceipt.statement).equals('Receipt statement...');
    });
  });

  describe('DELETE: `/sales/receipts/:id`', () => {
    it('Should the given sale receipt id be exists on the storage.', async () => {
      const res = await request()
        .delete('/api/sales/receipts/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'SALE.RECEIPT.NOT.FOUND',
        code: 200,
      });
    });

    it('Should delete the sale receipt with associated entries and journal transactions.', async () => {
      const saleReceipt = await tenantFactory.create('sale_receipt');
      const saleReceiptEntry = await tenantFactory.create(
        'sale_receipt_entry',
        {
          sale_receipt_id: saleReceipt.id,
        }
      );
      const res = await request()
        .delete(`/api/sales/receipts/${saleReceipt.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const storedSaleReceipt = await SaleReceipt.tenant()
        .query()
        .where('id', saleReceipt.id);
      const storedSaleReceiptEntries = await SaleReceipt.tenant()
        .query()
        .where('id', saleReceiptEntry.id);

      expect(res.status).equals(200);
      expect(storedSaleReceipt.length).equals(0);
      expect(storedSaleReceiptEntries.length).equals(0);
    });
  });

  describe('POST: `/sales/receipts/:id`', () => {
    it('Should the given sale receipt id be exists on the storage.', async () => {
      const res = await request()
        .post('/api/sales/receipts/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          deposit_account_id: 123,
          customer_id: 123,
          receipt_date: '2020-02-02',
          reference_no: '123',
          receipt_message: 'Receipt message...',
          statement: 'Receipt statement...',
          entries: [
            {
              item_id: 123,
              quantity: 1,
              rate: 2,
            },
          ],
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'SALE.RECEIPT.NOT.FOUND',
        code: 200,
      });
    });

    it('Should update the sale receipt details with associated entries.', async () => {
      const saleReceipt = await tenantFactory.create('sale_receipt');
      const depositAccount = await tenantFactory.create('account');
      const customer = await tenantFactory.create('customer');
      const item = await tenantFactory.create('item');

      const res = await request()
        .post(`/api/sales/receipts/${saleReceipt.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          deposit_account_id: depositAccount.id,
          customer_id: customer.id,
          receipt_date: '2020-02-02',
          reference_no: '123',
          receipt_message: 'Receipt message...',
          statement: 'Receipt statement...',
          entries: [
            {
              id: 100,
              item_id: item.id,
              quantity: 1,
              rate: 2,
            },
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ENTRIES.IDS.NOT.FOUND', code: 500,
      });
    });
  });

  describe('GET: `/sales/receipts`', () => {
    it('Should response the custom view id not exists on the storage.', async () => {
      const res = await request()
        .get('/api/sales/receipts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          
        });

      console.log(res.status, res.body);
    });
    
    it('Should retrieve all sales receipts on the storage with pagination meta.', () => {

    });
  });
});
