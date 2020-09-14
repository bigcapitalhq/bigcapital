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


describe('route: /currencies/', () => {
  describe('POST: `/api/currencies`', () => {
    it('Should response unauthorized in case user was not logged in.', async () => {
      const res = await request()
        .post('/api/currencies')
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should `currency_name` be required.', async () => {
      const res = await request()
        .post('/api/currencies')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'currency_name', location: 'body',
      });
    });

    it('Should `currency_code` be required.', async () => {
      const res = await request()
        .post('/api/currencies')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'currency_code', location: 'body',
      });
    });

    it('Should response currency code is duplicated.', async () => {
      tenantFactory.create('currency', { currency_code: 'USD' });

      const res = await request()
        .post('/api/currencies')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          currency_code: 'USD',
          currency_name: 'Dollar',
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CURRENCY.CODE.ALREADY.EXISTS', code: 100,
      });
    });

    it('Should insert currency details to the storage.', async () => {
      const res = await request()
        .post('/api/currencies')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          currency_code: 'USD',
          currency_name: 'Dollar',
        });

      const foundCurrency = await Currency.tenant().query().where('currency_code', 'USD');

      expect(foundCurrency.length).equals(1);
      expect(foundCurrency[0].currencyCode).equals('USD');
      expect(foundCurrency[0].currencyName).equals('Dollar');
    });

    it('Should response success with correct data.', async () => {
      const res = await request()
        .post('/api/currencies')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          currency_code: 'USD',
          currency_name: 'Dollar',
        });

      expect(res.status).equals(200);
    });
  });

  describe('DELETE: `/api/currencies/:currency_code`', () => {
    it('Should delete the given currency code from the storage.', async () => {
      const currency = await tenantFactory.create('currency');
      const res = await request()
        .delete(`/api/currencies/${currency.currencyCode}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);

      const foundCurrency = await Currency.tenant().query().where('currency_code', 'USD');
      expect(foundCurrency.length).equals(0);
    });
  });

  describe('POST: `/api/currencies/:id`', () => {
    it('Should `currency_name` be required.', async () => {
      const currency = await tenantFactory.create('currency');
      const res = await request()
        .post(`/api/currencies/${currency.code}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'currency_name', location: 'body',
      });
    });

    it('Should `currency_code` be required.', async () => {
      const currency = await tenantFactory.create('currency');
      const res = await request()
        .post(`/api/currencies/${currency.code}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'currency_code', location: 'body',
      });
    });

    it('Should response currency code is duplicated.', async () => {
      const currency1 = await tenantFactory.create('currency');
      const currency2 = await tenantFactory.create('currency');

      const res = await request()
        .post(`/api/currencies/${currency2.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          currency_code: currency1.currencyCode,
          currency_name: 'Dollar',
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'CURRENCY.CODE.ALREADY.EXISTS', code: 100,
      });
    });

    it('Should update currency details of the given currency on the storage.', async () => {
      const currency1 = await tenantFactory.create('currency');
      const currency2 = await tenantFactory.create('currency');

      const res = await request()
        .post(`/api/currencies/${currency2.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          currency_code: 'ABC',
          currency_name: 'Name',
        });

      const foundCurrency = await Currency.tenant().query().where('currency_code', 'ABC');

      expect(foundCurrency.length).equals(1);
      expect(foundCurrency[0].currencyCode).equals('ABC');
      expect(foundCurrency[0].currencyName).equals('Name');
    });

    it('Should response success with correct data.', () => {

    });
  })
});
