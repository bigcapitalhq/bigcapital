import {
  request,
  expect,
} from '~/testInit';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';

describe('route: `/api/purchases/bills`', () => {
  describe('POST: `/api/purchases/bills`', () => {
    it('Should `bill_number` be required.', async () => {
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'bill_number',
        location: 'body',
      });
    });

    it('Should `vendor_id` be required.', async () => {
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'vendor_id',
        location: 'body',
      });
    });

    it('Should `bill_date` be required.', async () => {
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'bill_date',
        location: 'body',
      });
    });

    it('Should `entries` be minimum one', async () => {
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'entries',
        location: 'body',
      });
    });

    it('Should `entries.*.item_id be required.', async () => {
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          entries: [{

          }]
        });
      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'entries[0].item_id',
        location: 'body'
      });
    });

    it('Should `entries.*.rate` be required.', async () => {
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          entries: [{

          }]
        });
      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'entries[0].rate',
        location: 'body'
      });
    });

    it('Should `entries.*.discount` be required.', () => {

    });

    it('Should entries.*.quantity be required.', () => {

    });


    it('Should vendor_id be exists on the storage.', async () => {
      const vendor = await tenantFactory.create('vendor');
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          vendor_id: vendor.id,
          bill_number: '123',
          bill_date: '2020-02-02',
          entries: [{
            item_id: 1,
            rate: 1,
            quantity: 1,
          }]
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'VENDOR.ID.NOT.FOUND', code: 300,
      })
    });

    it('Should entries.*.item_id be exists on the storage.', async () => {
      const item = await tenantFactory.create('item');
      const vendor = await tenantFactory.create('vendor');
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          vendor_id: vendor.id,
          bill_number: '123',
          bill_date: '2020-02-02',
          entries: [{
            item_id: 123123,
            rate: 1,
            quantity: 1,
          }]
        });
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ITEMS.IDS.NOT.FOUND', code: 400,
      });
    });

    it('Should validate the bill number is not exists on the storage.', async () => {
      const item = await tenantFactory.create('item');
      const vendor = await tenantFactory.create('vendor');
      const bill = await tenantFactory.create('bill', { bill_number: '123' });

      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          vendor_id: vendor.id,
          bill_number: '123',
          bill_date: '2020-02-02',
          entries: [{
            item_id: item.id,
            rate: 1,
            quantity: 1,
          }]
        }); 
      
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'BILL.NUMBER.EXISTS', code: 500,
      })
    })

    it('Should store the given bill details with associated entries to the storage.', async () => {
      const item = await tenantFactory.create('item');
      const vendor = await tenantFactory.create('vendor');
      const res = await request()
        .post('/api/purchases/bills')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          vendor_id: vendor.id,
          bill_number: '123',
          bill_date: '2020-02-02',
          entries: [{
            item_id: item.id,
            rate: 1,
            quantity: 1,
          }]
        });

      expect(res.status).equals(200);
    });

    
  });

  describe('DELETE: `/api/purchases/bills/:id`', () => {

  });
});