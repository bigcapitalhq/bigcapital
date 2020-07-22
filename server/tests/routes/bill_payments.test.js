import {
  request,
  expect,
} from '~/testInit';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';

describe('route: `/api/purchases/bill_payments`', () => {
  describe('POST: `/api/purchases/bill_payments`', () => {
    it('Should `payment_date` be required.', async () => {
      const res = await request()
        .post('/api/purchases/bills')
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

    it('Should `payment_account_id` be required.', async () => {
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'payment_account_id',
        location: 'body',
      });
    });

    it('Should `payment_number` be required.', async () => {
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'payment_number',
        location: 'body',
      });
    });

    it('Should `entries.*.item_id` be required.', async () => {
      const res = await request()
        .post('/api/purchases/bills')
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

    it('Should `payment_number` be unique on the storage.', () => {

    });

    it('Should `payment_account_id` be exists on the storage.', () => {

    });

    it('Should `entries.*.item_id` be exists on the storage.', () => {

    });

    it('Should store the given bill payment to the storage.', () => {

    });
  });

  describe('POST: `/api/purchases/bill_payments/:id`', () => {
    it('Should bill payment be exists on the storage.', () => {

    });
  });

  describe('DELETE: `/api/purchases/bill_payments/:id`', () => {
    it('Should bill payment be exists on the storage.', () => {

    });

    it('Should delete the given bill payment from the storage.', () => {

    });    
  });

  describe('GET: `/api/purchases/bill_payments/:id`', () => {
    it('Should bill payment be exists on the storage.', () => {

    });
  });
});