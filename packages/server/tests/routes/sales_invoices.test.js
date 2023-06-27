import { tenantWebsite, tenantFactory, loginRes } from '~/dbInit';
import { request, expect } from '~/testInit';
import { SaleInvoice } from 'models';
import { SaleInvoiceEntry } from '../../src/models';

describe('route: `/sales/invoices`', () => {
  describe('POST: `/sales/invoices`', () => {
    it('Should `customer_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices')
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

    it('Should `invoice_date` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'invoice_date',
        location: 'body',
      });
    });

    it('Should `due_date` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'due_date',
        location: 'body',
      });
    });

    it('Should `invoice_no` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'invoice_no',
        location: 'body',
      });
    });

    it('Should `status` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'status',
        location: 'body',
      });
    });

    it('Should `entries.*.item_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          entries: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'entries[0].item_id',
        location: 'body',
      });
    });

    it('Should `entries.*.quantity` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          entries: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'entries[0].quantity',
        location: 'body',
      });
    });

    it('Should `entries.*.rate` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          entries: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'entries[0].rate',
        location: 'body',
      });
    });

    it('Should `customer_id` be exists on the storage.', async () => {
      const customer = await tenantFactory.create('customer');
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: 123,
          invoice_date: '2020-02-02',
          due_date: '2020-03-03',
          invoice_no: '123',
          reference_no: '123',
          status: 'published',
          invoice_message: 'Invoice message...',
          terms_conditions: 'terms and conditions',
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 1,
              discount: 1,
            }
          ]
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMER.ID.NOT.EXISTS', code: 200,
      });
    });

    it('Should `invoice_date` be bigger than `due_date`.', async () => {
      
    });

    it('Should `invoice_no` be unique on the storage.', async () => {
      const saleInvoice = await tenantFactory.create('sale_invoice', {
        invoice_no: '123',
      });
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: 123,
          invoice_date: '2020-02-02',
          due_date: '2020-03-03',
          invoice_no: '123',
          reference_no: '123',
          status: 'published',
          invoice_message: 'Invoice message...',
          terms_conditions: 'terms and conditions',
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 1,
              discount: 1,
            }
          ]
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'SALE.INVOICE.NUMBER.IS.EXISTS', code: 200
      });
    });

    it('Should `entries.*.item_id` be exists on the storage.', async () => {
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: 123,
          invoice_date: '2020-02-02',
          due_date: '2020-03-03',
          invoice_no: '123',
          reference_no: '123',
          status: 'published',
          invoice_message: 'Invoice message...',
          terms_conditions: 'terms and conditions',
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 1,
              discount: 1,
            }
          ]
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ITEMS.IDS.NOT.EXISTS', code: 300,
      });
    });

    it('Should save the given sale invoice details with associated entries.', async () => {
      const customer = await tenantFactory.create('customer');
      const item = await tenantFactory.create('item');
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          invoice_date: '2020-02-02',
          due_date: '2020-03-03',
          invoice_no: '123',
          reference_no: '123',
          status: 'published',
          invoice_message: 'Invoice message...',
          terms_conditions: 'terms and conditions',
          entries: [
            {
              item_id: item.id,
              rate: 1,
              quantity: 1,
              discount: 1,
            }
          ]
        });
      expect(res.status).equals(200);
    });
  });

  describe('POST: `/api/sales/invoices/:id`', () => {
    it('Should `customer_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices/123')
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

    it('Should `invoice_date` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'invoice_date',
        location: 'body',
      });
    });
    

    it('Should `status` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'status',
        location: 'body',
      });
    });

    it('Should `entries.*.item_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          entries: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'entries[0].item_id',
        location: 'body',
      });
    });

    it('Should `entries.*.quantity` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          entries: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'entries[0].quantity',
        location: 'body',
      });
    });

    it('Should `entries.*.rate` be required.', async () => {
      const res = await request()
        .post('/api/sales/invoices/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          entries: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'entries[0].rate',
        location: 'body',
      });
    });

    it('Should `customer_id` be exists on the storage.', async () => {
      const customer = await tenantFactory.create('customer');
      const saleInvoice = await tenantFactory.create('sale_invoice');

      const res = await request()
        .post(`/api/sales/invoices/${saleInvoice.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: 123,
          invoice_date: '2020-02-02',
          due_date: '2020-03-03',
          invoice_no: '123',
          reference_no: '123',
          status: 'published',
          invoice_message: 'Invoice message...',
          terms_conditions: 'terms and conditions',
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 1,
              discount: 1,
            }
          ]
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMER.ID.NOT.EXISTS', code: 200,
      });
    });

    it('Should `invoice_date` be bigger than `due_date`.', async () => {
      
    });

    it('Should `invoice_no` be unique on the storage.', async () => {
      const saleInvoice = await tenantFactory.create('sale_invoice', {
        invoice_no: '123',
      });
      const res = await request()
        .post('/api/sales/invoices')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: 123,
          invoice_date: '2020-02-02',
          due_date: '2020-03-03',
          invoice_no: '123',
          reference_no: '123',
          status: 'published',
          invoice_message: 'Invoice message...',
          terms_conditions: 'terms and conditions',
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 1,
              discount: 1,
            }
          ]
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'SALE.INVOICE.NUMBER.IS.EXISTS', code: 200
      });
    });

    it('Should update the sale invoice details with associated entries.', async () => {
      const saleInvoice = await tenantFactory.create('sale_invoice');
      const customer = await tenantFactory.create('customer');
      const item = await tenantFactory.create('item');

      const res = await request()
        .post(`/api/sales/invoices/${saleInvoice.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          invoice_date: '2020-02-02',
          due_date: '2020-03-03',
          invoice_no: '1',
          reference_no: '123',
          status: 'published',
          invoice_message: 'Invoice message...',
          terms_conditions: 'terms and conditions',
          entries: [
            {
              item_id: item.id,
              rate: 1,
              quantity: 1,
              discount: 1,
            }
          ]
        });
      expect(res.status).equals(200);
    });
  });

  describe('DELETE: `/sales/invoices/:id`', () => {
    it('Should retrieve sale invoice not found.', async () => {
      const res = await request()
        .delete('/api/sales/invoices/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'SALE.INVOICE.NOT.FOUND', code: 200,
      });
    });

    it('Should delete the given sale invoice with associated entries.', async () => {
      const saleInvoice = await tenantFactory.create('sale_invoice');
      const saleInvoiceEntry = await tenantFactory.create('sale_invoice_entry', {
        sale_invoice_id: saleInvoice.id,
      });

      const res = await request()
        .delete(`/api/sales/invoices/${saleInvoice.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const storedSaleInvoice = await SaleInvoice.tenant().query().where('id', saleInvoice.id);
      const storedSaleInvoiceEntry = await SaleInvoiceEntry.tenant().query().where('id', saleInvoiceEntry.id);

      expect(res.status).equals(200);
      expect(storedSaleInvoice.length).equals(0);
      expect(storedSaleInvoiceEntry.length).equals(0);
    });
  });
});