import moment from 'moment';
import {
  request,
  expect,
} from '~/testInit';
import ExchangeRate from '../../src/models/ExchangeRate';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('route: /exchange_rates/', () => {
  describe('POST: `/api/exchange_rates`', () => {
    it('Should response unauthorized in case the user was not logged in.', async () => {
      const res = await request()
        .post('/api/exchange_rates')
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should `currency_code` be required.', async () => {
      const res = await request()
        .post('/api/exchange_rates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'currency_code', location: 'body',
      });
    });

    it('Should `exchange_rate` be required.', async () => {
      const res = await request()
        .post('/api/exchange_rates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'exchange_rate', location: 'body',
      });
    });

    it('Should date be required', async () => {
      const res = await request()
        .post('/api/exchange_rates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'date', location: 'body',
      });
    });

    it('Should response date and currency code is already exists.', async () => {
      await tenantFactory.create('exchange_rate', {
        date: '2020-02-02',
        currency_code: 'USD',
        exchange_rate: 4.4,
      });
      const res = await request()
        .post('/api/exchange_rates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: '2020-02-02',
          currency_code: 'USD',
          exchange_rate: 4.4,
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXCHANGE.RATE.DATE.PERIOD.DEFINED', code: 200,
      });
    });

    it('Should save the given exchange rate to the storage.', async () => {
      const res = await request()
        .post('/api/exchange_rates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: '2020-02-02',
          currency_code: 'USD',
          exchange_rate: 4.4,
        });
      expect(res.status).equals(200);

      const foundExchangeRate = await ExchangeRate.tenant().query()
        .where('currency_code', 'USD');

      expect(foundExchangeRate.length).equals(1);
      expect(
        moment(foundExchangeRate[0].date).format('YYYY-MM-DD'),
      ).equals('2020-02-02');
      expect(foundExchangeRate[0].currencyCode).equals('USD');
      expect(foundExchangeRate[0].exchangeRate).equals(4.4);
    });
  });

  describe('GET: `/api/exchange_rates', () => {
    it('Should retrieve all exchange rates with pagination meta.', async () => {
      await tenantFactory.create('exchange_rate');
      await tenantFactory.create('exchange_rate');
      await tenantFactory.create('exchange_rate');

      const res = await request()
        .get('/api/exchange_rates')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);
      expect(res.body.exchange_rates.results.length).equals(3);
    });
  });

  describe('POST: `/api/exchange_rates/:id`', () => {
    it('Should response the given exchange rate not found.', async () => {
      const res = await request()
        .post('/api/exchange_rates/100')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          date: '2020-02-02', 
          currency_code: 'USD',
          exchange_rate: 4.4,
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXCHANGE.RATE.NOT.FOUND', code: 200,
      });
    });

    it('Should update exchange rate of the given id on the storage.', async () => {
      const exRate = await tenantFactory.create('exchange_rate');
      const res = await request()
        .post(`/api/exchange_rates/${exRate.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          exchange_rate: 4.4,
        });
      expect(res.status).equals(200);

      const foundExchangeRate = await ExchangeRate.tenant().query()
        .where('id', exRate.id);

      expect(foundExchangeRate.length).equals(1);
      expect(foundExchangeRate[0].exchangeRate).equals(4.4);
    });
  });

  describe('DELETE: `/api/exchange_rates/:id`', () => {
    it('Should response the given exchange rate id not found.', async () => {
      const res = await request()
        .delete('/api/exchange_rates/100')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXCHANGE.RATE.NOT.FOUND', code: 200,
      });
    });

    it('Should delete the given exchange rate id from the storage.', async () => {
      const exRate = await tenantFactory.create('exchange_rate');
      const res = await request()
        .delete(`/api/exchange_rates/${exRate.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const foundRates = await ExchangeRate.tenant().query();
      expect(foundRates.length).equals(0);
    });
  });

  describe('DELETE: `/api/exchange_rates/bulk`', () => {
    it('Should response the given exchange rates ids where not found.', async () => {
      const res = await request()
        .delete('/api/exchange_rates/bulk')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [12332, 32432],
        })
        .send();

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'EXCHANGE.RATES.IS.NOT.FOUND', code: 200, ids: [12332, 32432],
      })
    });

    it('Should delete the given exchange rates ids.', async () => {
      const exRate = await tenantFactory.create('exchange_rate');
      const exRate2 = await tenantFactory.create('exchange_rate');

      const res = await request()
        .delete('/api/exchange_rates/bulk')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [exRate.id, exRate2.id],
        })
        .send();

      const foundExchangeRate = await ExchangeRate.tenant().query()
        .whereIn('id', [exRate.id, exRate2.id]);

      expect(foundExchangeRate.length).equals(0);
    })
  });
});
