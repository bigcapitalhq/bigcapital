import {
  request,
  expect,
} from '~/testInit';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';
import {
  PaymentReceive,
  PaymentReceiveEntry,
} from 'models';

describe('route: `/sales/payment_receives`', () => {
  describe('POST: `/sales/payment_receives`', () => {
    it('Should `customer_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/payment_receives')
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

    it('Should `payment_date` be required.', async () => {
      const res = await request()
        .post('/api/sales/payment_receives')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'payment_date',
        location: 'body',
      });
    });

    it('Should `deposit_account_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/payment_receives')
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

    it('Should `payment_receive_no` be required.', async () => {
      const res = await request()
        .post('/api/sales/payment_receives')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'payment_receive_no',
        location: 'body',
      });
    });

    it('Should invoices IDs be required.', async () => {
      const res = await request()
        .post('/api/sales/payment_receives')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'payment_receive_no',
        location: 'body',
      });
    });

    it('Should `customer_id` be exists on the storage.', async () => {
      const res = await request()
        .post('/api/sales/payment_receives')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: 123,
          payment_date: '2020-02-02',
          reference_no: '123',
          deposit_account_id: 100,
          payment_receive_no: '123',
          entries: [
            {
              invoice_id: 1,
              payment_amount: 1000,
            }
          ],
        });
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMER.ID.NOT.EXISTS', code: 200,
      });
    });

    it('Should `deposit_account_id` be exists on the storage.', async () => {
      const customer = await tenantFactory.create('customer');
      const res = await request()
        .post('/api/sales/payment_receives')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          payment_date: '2020-02-02',
          reference_no: '123',
          deposit_account_id: 10000,
          payment_receive_no: '123',
          entries: [
            {
              invoice_id: 1,
              payment_amount: 1000,
            }
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300,
      });
    });

    it('Should invoices IDs be exist on the storage.', async () => {
      const customer = await tenantFactory.create('customer');
      const account = await tenantFactory.create('account');

      const res = await request()
        .post('/api/sales/payment_receives')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          payment_date: '2020-02-02',
          reference_no: '123',
          deposit_account_id: account.id,
          payment_receive_no: '123',
          entries: [
            {
              invoice_id: 1,
              payment_amount: 1000,
            }
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300,
      });
    });

    it('Should payment receive number be unique on the storage.', async () => {
      const customer = await tenantFactory.create('customer');
      const account = await tenantFactory.create('account');
      const paymentReceive = await tenantFactory.create('payment_receive', {
        payment_receive_no: '123',
      });

      const res = await request()
        .post('/api/sales/payment_receives')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          payment_date: '2020-02-02',
          reference_no: '123',
          deposit_account_id: account.id,
          payment_receive_no: '123',
          entries: [
            {
              invoice_id: 1,
              payment_amount: 1000,
            }
          ],
        });
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'PAYMENT.RECEIVE.NUMBER.EXISTS', code: 400,
      });
    });
    
    it('Should store the payment receive details with associated entries.', async () => {
      const customer = await tenantFactory.create('customer');
      const account = await tenantFactory.create('account');
      const invoice = await tenantFactory.create('sale_invoice');
      
      const res = await request()
        .post('/api/sales/payment_receives')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          payment_date: '2020-02-02',
          reference_no: '123',
          deposit_account_id: account.id,
          payment_receive_no: '123',
          entries: [
            {
              invoice_id: invoice.id,
              payment_amount: 1000,
            }
          ],
        });

      const storedPaymentReceived = await PaymentReceive.tenant().query().where('id', res.body.id).first();

      expect(res.status).equals(200);
      expect(storedPaymentReceived.customerId).equals(customer.id)
      expect(storedPaymentReceived.referenceNo).equals('123');
      expect(storedPaymentReceived.paymentReceiveNo).equals('123');
    });
  });

  describe('POST: `/sales/payment_receives/:id`', () => {
    it('Should update the payment receive details with associated entries.', async () => {
      const paymentReceive = await tenantFactory.create('payment_receive');
      const customer = await tenantFactory.create('customer');
      const account = await tenantFactory.create('account');
      const invoice = await tenantFactory.create('sale_invoice');

      const res = await request()
        .post(`/api/sales/payment_receives/${paymentReceive.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          payment_date: '2020-02-02',
          reference_no: '123',
          deposit_account_id: account.id,
          payment_receive_no: '123',
          entries: [
            {
              invoice_id: invoice.id,
              payment_amount: 1000,
            }
          ],
        });
      expect(res.status).equals(200);
    });
  });

  describe('DELETE: `/sales/payment_receives/:id`', () => {
    it('Should response the given payment receive is not exists on the storage.', async () => {
      const res = await request()
        .delete(`/api/sales/payment_receives/123`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'PAYMENT.RECEIVE.NO.EXISTS', code: 600,
      });
    });
  });
});