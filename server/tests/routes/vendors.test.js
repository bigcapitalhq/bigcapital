import {
  request,
  expect,
} from '~/testInit';
import Currency from 'models/Currency';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';
import Vendor from 'models/Vendor';

describe('route: `/vendors`', () => {
  describe('POST: `/vendors`', () => {
    it('Should response unauthorized in case the user was not logged in.', async () => {
      const res = await request()
        .post('/api/vendors')
        .send({});

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should `display_name` be required field.', async () => {
      const res = await request()
        .post('/api/vendors')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({

        });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'display_name', location: 'body',
      })
    });

    it('Should store the vendor data to the storage.', async () => {
      const res = await request()
        .post('/api/vendors')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          first_name: 'Ahmed',
          last_name: 'Bouhuolia',

          company_name: 'Bigcapital',

          display_name: 'Ahmed Bouhuolia, Bigcapital',

          email: 'a.bouhuolia@live.com',
          work_phone: '0927918381',
          personal_phone: '0925173379',

          billing_address_city: 'Tripoli',
          billing_address_country: 'Libya',
          billing_address_email: 'a.bouhuolia@live.com',
          billing_address_state: 'State Tripoli',
          billing_address_zipcode: '21892',

          shipping_address_city: 'Tripoli',
          shipping_address_country: 'Libya',
          shipping_address_email: 'a.bouhuolia@live.com',
          shipping_address_state: 'State Tripoli',
          shipping_address_zipcode: '21892',
          
          note: '__desc__',

          active: true,
        });

      expect(res.status).equals(200);

      const foundVendor = await Vendor.tenant().query().where('id', res.body.id);

      expect(foundVendor[0].firstName).equals('Ahmed');
      expect(foundVendor[0].lastName).equals('Bouhuolia');
      expect(foundVendor[0].companyName).equals('Bigcapital');
      expect(foundVendor[0].displayName).equals('Ahmed Bouhuolia, Bigcapital');

      expect(foundVendor[0].email).equals('a.bouhuolia@live.com');
      
      expect(foundVendor[0].workPhone).equals('0927918381');
      expect(foundVendor[0].personalPhone).equals('0925173379');

      expect(foundVendor[0].billingAddressCity).equals('Tripoli');
      expect(foundVendor[0].billingAddressCountry).equals('Libya');
      expect(foundVendor[0].billingAddressEmail).equals('a.bouhuolia@live.com');
      expect(foundVendor[0].billingAddressState).equals('State Tripoli');
      expect(foundVendor[0].billingAddressZipcode).equals('21892');
      
      expect(foundVendor[0].shippingAddressCity).equals('Tripoli');
      expect(foundVendor[0].shippingAddressCountry).equals('Libya');
      expect(foundVendor[0].shippingAddressEmail).equals('a.bouhuolia@live.com');
      expect(foundVendor[0].shippingAddressState).equals('State Tripoli');
      expect(foundVendor[0].shippingAddressZipcode).equals('21892');
    });
  });

  describe('GET: `/vendors/:id`', () => {
    it('Should response not found in case the given vendor id was not exists on the storage.', async () => {
      const res = await request()
        .get('/api/vendors/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'VENDOR.NOT.FOUND', code: 200,
      });
    });
  });

  describe('GET: `vendors`', () => {
    it('Should response vendors items', async () => {
      await tenantFactory.create('vendor');
      await tenantFactory.create('vendor');

      const res = await request()
        .get('/api/vendors')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.body.vendors.results.length).equals(2);
    });
  });

  describe('DELETE: `/vendors/:id`', () => {
    it('Should response not found in case the given vendor id was not exists on the storage.', async () => {
      const res = await request()
        .delete('/api/vendors/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'VENDOR.NOT.FOUND', code: 200,
      });
    });

    it('Should delete the given vendor from the storage.', async () => {
      const vendor = await tenantFactory.create('vendor');
      const res = await request()
        .delete(`/api/vendors/${vendor.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);

      const foundVendor = await Vendor.tenant().query().where('id', vendor.id);
      expect(foundVendor.length).equals(0);
    })
  });

  describe('POST: `/vendors/:id`', () => {
    it('Should response vendor not found', async () => {
      const res = await request()
        .post('/api/vendors/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          display_name: 'Ahmed Bouhuolia, Bigcapital',
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'VENDOR.NOT.FOUND', code: 200,
      });
    });

    it('Should update details of the given vendor.', async () => {
      const vendor = await tenantFactory.create('vendor');
      const res = await request()
        .post(`/api/vendors/${vendor.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          display_name: 'Ahmed Bouhuolia, Bigcapital',
        });

      expect(res.status).equals(200);
      const foundVendor = await Vendor.tenant().query().where('id', res.body.id);

      expect(foundVendor.length).equals(1);
      expect(foundVendor[0].displayName).equals('Ahmed Bouhuolia, Bigcapital');
    })
  });
});
