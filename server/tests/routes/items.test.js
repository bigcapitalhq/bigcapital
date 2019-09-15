import {
  request,
  expect,
  create,
  login,
} from '~/testInit';
import knex from '@/database/knex';

describe.only('routes: `/items`', () => {
  describe.only('POST: `/items`', () => {
    it('Should not create a new item if the user was not authorized.', async () => {
      const res = await request().post('/api/items').send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('unauthorized');
    });

    it('Should user have create permission to create a new item.', async () => {
      const loginRes = await login();
      const res = await request().post('/api/items')
        .set('x-access-token', loginRes.body.token).send();

      expect(res.status).equals(401);
    });

    it('Should `name` be required.', async () => {
      const res = await request().post('/api/items').send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundNameParam = res.body.errors.find((error) => error.param === 'name');
      expect(!!foundNameParam).equals(true);
    });

    it('Should `type_id` be required.', async () => {
      const res = await request().post('/api/items').send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundTypeParam = res.body.errors.find((error) => error.param === 'type_id');
      expect(!!foundTypeParam).equals(true);
    });

    it('Should `buy_price` be numeric.', async () => {
      const res = await request().post('/api/items').send({
        buy_price: 'not_numeric',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundBuyPrice = res.body.errors.find((error) => error.param === 'buy_price');
      expect(!!foundBuyPrice).equals(true);
    });

    it('Should `cost_price` be numeric.', async () => {
      const res = await request().post('/api/items').send({
        cost_price: 'not_numeric',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundCostParam = res.body.errors.find((error) => error.param === 'cost_price');
      expect(!!foundCostParam).equals(true);
    });

    it('Should `buy_account_id` be integer.', async () => {
      const res = await request().post('/api/items').send({
        buy_account_id: 'not_numeric',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundAccount = res.body.errors.find((error) => error.param === 'buy_account_id');
      expect(!!foundAccount).equals(true);
    });

    it('Should `cost_account_id` be integer.', async () => {
      const res = await request().post('/api/items').send({
        cost_account_id: 'not_numeric',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundAccount = res.body.errors.find((error) => error.param === 'cost_account_id');
      expect(!!foundAccount).equals(true);
    });

    it('Should `cost_account_id` be required if `cost_price` was presented.', async () => {

    });

    it('Should `buy_account_id` be required if `buy_price` was presented.', async () => {

    });

    it('Should response bad request in case cost account was not exist.', async () => {
      const res = await request().post('/api/items').send({
        name: 'Item Name',
        type_id: 1,
        buy_price: 10.2,
        cost_price: 20.2,
        sell_account_id: 10,
        cost_account_id: 20,
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'COST_ACCOUNT_NOT_FOUND', code: 100,
      });
    });

    it('Should response bad request in case sell account was not exist.', async () => {
      const res = await request().post('/api/items').send({
        name: 'Item Name',
        type_id: 1,
        buy_price: 10.2,
        cost_price: 20.2,
        sell_account_id: 10,
        cost_account_id: 20,
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'SELL_ACCOUNT_NOT_FOUND', code: 120,
      });
    });

    it('Should response not category found in case item category was not exist.', async () => {
      const res = await request().post('/api/items').send({
        name: 'Item Name',
        type_id: 1,
        buy_price: 10.2,
        cost_price: 20.2,
        sell_account_id: 10,
        cost_account_id: 20,
        category_id: 20,
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'ITEM_CATEGORY_NOT_FOUND', code: 140,
      });
    });

    it('Should response success with correct data format.', async () => {
      const account = await create('account');
      const anotherAccount = await create('account');
      const itemCategory = await create('item_category');

      const res = await request().post('/api/items').send({
        name: 'Item Name',
        type_id: 1,
        buy_price: 10.2,
        cost_price: 20.2,
        sell_account_id: account.id,
        cost_account_id: anotherAccount.id,
        category_id: itemCategory.id,
      });

      expect(res.status).equals(200);
    });
  });

  describe('DELETE: `items/:id`', () => {
    it('Should response not found in case the item was not exist.', async () => {
      const res = await request().delete('/api/items/10').send();

      expect(res.status).equals(404);
    });

    it('Should response success in case was exist.', async () => {
      const item = await create('item');
      const res = await request().delete(`/api/items/${item.id}`);

      expect(res.status).equals(200);
    });

    it('Should delete the given item from the storage.', async () => {
      const item = await create('item');
      await request().delete(`/api/items/${item.id}`);

      const storedItem = await knex('items').where('id', item.id);
      expect(storedItem).to.have.lengthOf(0);
    });
  });
});
