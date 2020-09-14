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
import Customer from '../../src/models/Customer';

describe('route: `/customers`', () => {
  describe('POST: `/customers`', () => {
    it('Should response unauthorized in case the user was not logged in.', async () => {
      const res = await request()
        .post('/api/customers')
        .send({});

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should `display_name` be required field.', async () => {
      const res = await request()
        .post('/api/customers')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({

        });

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'display_name', location: 'body',
      })
    });

    it('Should `customer_type` be required field', async () => {
      const res = await request()
        .post('/api/customers')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'customer_type', location: 'body',
      });
    });

    it('Should store the customer data to the storage.', async () => {
      const res = await request()
        .post('/api/customers')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_type: 'business',

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

      const foundCustomer = await Customer.tenant().query().where('id', res.body.id);

      expect(foundCustomer[0].customerType).equals('business');
      expect(foundCustomer[0].firstName).equals('Ahmed');
      expect(foundCustomer[0].lastName).equals('Bouhuolia');
      expect(foundCustomer[0].companyName).equals('Bigcapital');
      expect(foundCustomer[0].displayName).equals('Ahmed Bouhuolia, Bigcapital');

      expect(foundCustomer[0].email).equals('a.bouhuolia@live.com');
      
      expect(foundCustomer[0].workPhone).equals('0927918381');
      expect(foundCustomer[0].personalPhone).equals('0925173379');

      expect(foundCustomer[0].billingAddressCity).equals('Tripoli');
      expect(foundCustomer[0].billingAddressCountry).equals('Libya');
      expect(foundCustomer[0].billingAddressEmail).equals('a.bouhuolia@live.com');
      expect(foundCustomer[0].billingAddressState).equals('State Tripoli');
      expect(foundCustomer[0].billingAddressZipcode).equals('21892');
      
      expect(foundCustomer[0].shippingAddressCity).equals('Tripoli');
      expect(foundCustomer[0].shippingAddressCountry).equals('Libya');
      expect(foundCustomer[0].shippingAddressEmail).equals('a.bouhuolia@live.com');
      expect(foundCustomer[0].shippingAddressState).equals('State Tripoli');
      expect(foundCustomer[0].shippingAddressZipcode).equals('21892');
    });
  });

  describe('GET: `/customers/:id`', () => {
    it('Should response not found in case the given customer id was not exists on the storage.', async () => {
      const res = await request()
        .get('/api/customers/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMER.NOT.FOUND', code: 200,
      });
    });
  });

  describe('GET: `customers`', () => {
    it('Should response customers items', async () => {
      await tenantFactory.create('customer');
      await tenantFactory.create('customer');

      const res = await request()
        .get('/api/customers')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.body.customers.results.length).equals(2);
    });
  });

  describe('DELETE: `/customers/:id`', () => {
    it('Should response not found in case the given customer id was not exists on the storage.', async () => {
      const res = await request()
        .delete('/api/customers/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMER.NOT.FOUND', code: 200,
      });
    });

    it('Should delete the given customer from the storage.', async () => {
      const customer = await tenantFactory.create('customer');
      const res = await request()
        .delete(`/api/customers/${customer.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);

      const foundCustomer = await Customer.tenant().query().where('id', customer.id);
      expect(foundCustomer.length).equals(0);
    })
  });

  describe('POST: `/customers/:id`', () => {
    it('Should response customer not found', async () => {
      const res = await request()
        .post('/api/customers/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_type: 'business',
          display_name: 'Ahmed Bouhuolia, Bigcapital',
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMER.NOT.FOUND', code: 200,
      });
    });

    it('Should update details of the given customer.', async () => {
      const customer = await tenantFactory.create('customer');
      const res = await request()
        .post(`/api/customers/${customer.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          customer_type: 'business',
          display_name: 'Ahmed Bouhuolia, Bigcapital',
        });

      expect(res.status).equals(200);
      const foundCustomer = await Customer.tenant().query().where('id', res.body.id);

      expect(foundCustomer.length).equals(1);
      expect(foundCustomer[0].customerType).equals('business');
      expect(foundCustomer[0].displayName).equals('Ahmed Bouhuolia, Bigcapital');
    })
  });

  describe('DELETE: `customers`', () => {
    it('Should response customers ids not found.', async () => {
      const res = await request()
        .delete('/api/customers')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [100, 200],
        })
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CUSTOMERS.NOT.FOUND', code: 200,        
      });
    });

    it('Should delete the given customers.', async () => {
      const customer1 = await tenantFactory.create('customer');
      const customer2 = await tenantFactory.create('customer');

      const res = await request()
        .delete('/api/customers')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [customer1.id, customer2.id],
        })
        .send();

      const foundCustomers = await Customer.tenant().query()
        .whereIn('id', [customer1.id, customer2.id]);

      expect(res.status).equals(200);
      expect(foundCustomers.length).equals(0);
    });
  })
});
