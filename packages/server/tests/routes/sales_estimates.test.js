const { iteratee } = require('lodash');
import { tenantWebsite, tenantFactory, loginRes } from '~/dbInit';
import { request, expect } from '~/testInit';
import { SaleEstimate, SaleEstimateEntry } from '../../src/models';

describe('route: `/sales/estimates`', () => {
  describe('POST: `/sales/estimates`', () => {
    it('Should `customer_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/estimates')
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

    it('Should `estimate_date` be required.', async () => {
      const res = await request()
        .post('/api/sales/estimates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'estimate_date',
        location: 'body',
      });
    });

    it('Should `estimate_number` be required.', async () => {
      const res = await request()
        .post('/api/sales/estimates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'estimate_number',
        location: 'body',
      });
    });

    it('Should `entries` be atleast one entry.', async () => {
      const res = await request()
        .post('/api/sales/estimates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          entries: [],
        });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        value: [],
        msg: 'Invalid value',
        param: 'entries',
        location: 'body',
      });
    });

    it('Should `entries.*.item_id` be required.', async () => {
      const res = await request()
        .post('/api/sales/estimates')
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
        .post('/api/sales/estimates')
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

    it('Should be `entries.*.rate` be required.', async () => {
      const res = await request()
        .post('/api/sales/estimates')
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
      const res = await request()
        .post('/api/sales/estimates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: 10,
          estimate_date: '2020-02-02',
          expiration_date: '2020-03-03',
          estimate_number: '1',
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 2,
            }
          ],
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMER.ID.NOT.FOUND', code: 200,
      });
    });

    it('Should `estimate_number` be unique on the storage.', async () => {
      const saleEstimate = await tenantFactory.create('sale_estimate');

      const res = await request()
        .post('/api/sales/estimates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: saleEstimate.customerId,
          estimate_date: '2020-02-02',
          expiration_date: '2020-03-03',
          estimate_number: saleEstimate.estimateNumber,
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 2,
            }
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ESTIMATE.NUMBER.IS.NOT.UNIQUE', code: 300,
      });
    });

    it('Should `entries.*.item_id` be exists on the storage.', async () => {
      const customer = await tenantFactory.create('customer');
      const res = await request()
        .post('/api/sales/estimates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          estimate_date: '2020-02-02',
          expiration_date: '2020-03-03',
          estimate_number: '12',
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 2,
            }
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ITEMS.IDS.NOT.EXISTS', code: 400,
      });
    });

    it('Should store the given details on the storage.', async () => {
      const customer = await tenantFactory.create('customer');
      const item = await tenantFactory.create('item');

      const res = await request()
        .post('/api/sales/estimates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          estimate_date: '2020-02-02',
          expiration_date: '2020-03-03',
          estimate_number: '12',
          reference: 'reference',
          note: 'note here',
          terms_conditions: 'terms and conditions',
          entries: [
            {
              item_id: item.id,
              rate: 1,
              quantity: 2,
              description: 'desc..'
            }
          ],
        });

      expect(res.status).equals(200);

      const storedEstimate = await SaleEstimate.tenant().query().where('id', res.body.id).first();
      const storedEstimateEntry = await SaleEstimateEntry.tenant().query().where('estimate_id', res.body.id).first();

      expect(storedEstimate.id).equals(res.body.id);
      expect(storedEstimate.customerId).equals(customer.id);
      expect(storedEstimate.reference).equals('reference')
      expect(storedEstimate.note).equals('note here');
      expect(storedEstimate.termsConditions).equals('terms and conditions');
      expect(storedEstimate.estimateNumber).equals('12');

      expect(storedEstimateEntry.itemId).equals(item.id);
      expect(storedEstimateEntry.rate).equals(1);
      expect(storedEstimateEntry.quantity).equals(2);
      expect(storedEstimateEntry.description).equals('desc..');
    });
  });

  describe('DELETE: `/sales/estimates/:id`', () => {
    it('Should estimate id be exists on the storage.', async () => {
      const estimate = await tenantFactory.create('sale_estimate');
      const res = await request()
        .delete(`/api/sales/estimates/123`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'SALE.ESTIMATE.ID.NOT.FOUND', code: 200
      });
    });

    it('Should delete the given estimate with associated entries from the storage.', async () => {
      const estimate = await tenantFactory.create('sale_estimate');
      const estimateEntry = await tenantFactory.create('sale_estimate_entry', { estimate_id: estimate.id });

      const res = await request()
        .delete(`/api/sales/estimates/${estimate.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const foundEstimate = await SaleEstimate.tenant().query().where('id', estimate.id);
      const foundEstimateEntry = await SaleEstimateEntry.tenant().query().where('estimate_id', estimate.id);

      expect(res.status).equals(200);
      expect(foundEstimate.length).equals(0);
      expect(foundEstimateEntry.length).equals(0);
    });
  });

  describe('POST: `/sales/estimates/:id`', () => {
    it('Should estimate id be exists on the storage.', async () => {
      const customer = await tenantFactory.create('customer');
      const item = await tenantFactory.create('item');

      const res = await request()
        .post(`/api/sales/estimates/123`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          estimate_date: '2020-02-02',
          expiration_date: '2020-03-03',
          estimate_number: '12',
          reference: 'reference',
          note: 'note here',
          terms_conditions: 'terms and conditions',
          entries: [
            {
              item_id: item.id,
              rate: 1,
              quantity: 2,
              description: 'desc..'
            }
          ],
        })

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'SALE.ESTIMATE.ID.NOT.FOUND', code: 200
      });  
    });

    it('Should `entries.*.item_id` be exists on the storage.', async () => {
      const saleEstimate = await tenantFactory.create('sale_estimate');
      const customer = await tenantFactory.create('customer');

      const res = await request()
        .post(`/api/sales/estimates/${saleEstimate.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          estimate_date: '2020-02-02',
          expiration_date: '2020-03-03',
          estimate_number: '12',
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 2,
            }
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ITEMS.IDS.NOT.EXISTS', code: 400
      });
    });

    it('Should sale estimate number unique on the storage.', async () => {
      const saleEstimate = await tenantFactory.create('sale_estimate');
      const saleEstimate2 = await tenantFactory.create('sale_estimate');

      const res = await request()
        .post(`/api/sales/estimates/${saleEstimate.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: saleEstimate.customerId,
          estimate_date: '2020-02-02',
          expiration_date: '2020-03-03',
          estimate_number: saleEstimate2.estimateNumber,
          entries: [
            {
              item_id: 1,
              rate: 1,
              quantity: 2,
            }
          ],
        });
      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ESTIMATE.NUMBER.IS.NOT.UNIQUE', code: 300,
      });
    });

    it('Should sale estimate entries IDs be exists on the storage and associated to the sale estimate.', async () => {
      const item = await tenantFactory.create('item');
      const saleEstimate = await tenantFactory.create('sale_estimate');
      const saleEstimate2 = await tenantFactory.create('sale_estimate');

      const res = await request()
        .post(`/api/sales/estimates/${saleEstimate.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: saleEstimate.customerId,
          estimate_date: '2020-02-02',
          expiration_date: '2020-03-03',
          estimate_number: saleEstimate.estimateNumber,
          entries: [
            {
              id: 100,
              item_id: item.id,
              rate: 1,
              quantity: 2,
            }
          ],
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ESTIMATE.NOT.FOUND.ENTRIES.IDS', code: 500,
      });
    });

    it('Should update the given sale estimates with associated entries.', async () => {
      const customer = await tenantFactory.create('customer');
      const item = await tenantFactory.create('item');
      const saleEstimate = await tenantFactory.create('sale_estimate');
      const saleEstimateEntry = await tenantFactory.create('sale_estimate_entry', {
        estimate_id: saleEstimate.id,
      });

      const res = await request()
        .post(`/api/sales/estimates/${saleEstimate.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_id: customer.id,
          estimate_date: '2020-02-02',
          expiration_date: '2020-03-03',
          estimate_number: '123',
          entries: [
            {
              id: saleEstimateEntry.id,
              item_id: item.id,
              rate: 100,
              quantity: 200,
            }
          ],
        });
      expect(res.status).equals(200);
    });
  });


  describe('GET: `/sales/estimates`', () => {
    it('Should retrieve sales estimates.', async () => {
      const res = await request()
        .get('/api/sales/estimates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      console.log(res.status, res.body);
    });
  });
});
