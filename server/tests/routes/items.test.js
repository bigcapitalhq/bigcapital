import {
  request,
  expect,
  create,
  login,
} from '~/testInit';
import knex from '@/database/knex';
import Item from '@/models/Item';

let loginRes;

describe('routes: `/items`', () => {
  beforeEach(async () => {
    loginRes = await login();
  });
  afterEach(() => {
    loginRes = null;
  });
  describe('POST: `/items`', () => {
    it('Should not create a new item if the user was not authorized.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send();

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
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'name', location: 'body',
      });
    });

    it('Should `type_id` be required.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'type_id', location: 'body',
      });
    });

    it('Should `buy_price` be numeric.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send({
          buy_price: 'not_numeric',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({ 
        value: 'not_numeric',
        msg: 'Invalid value',
        param: 'buy_price',
        location: 'body',
      });
    });

    it('Should `cost_price` be numeric.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send({
          cost_price: 'not_numeric',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({ 
        value: 'not_numeric',
        msg: 'Invalid value',
        param: 'cost_price',
        location: 'body',
      });
    });

    it('Should `sell_account_id` be integer.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send({
          sell_account_id: 'not_numeric',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        value: 'not_numeric',
        msg: 'Invalid value',
        param: 'sell_account_id',
        location: 'body',
      });
    });

    it('Should `cost_account_id` be integer.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send({
          cost_account_id: 'not_numeric',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        value: 'not_numeric',
        msg: 'Invalid value',
        param: 'cost_account_id',
        location: 'body',
      });
    });

    it('Should `cost_account_id` be required if `cost_price` was presented.', async () => {

    });

    it('Should `buy_account_id` be required if `buy_price` was presented.', async () => {

    });

    it('Should response bad request in case cost account was not exist.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send({
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
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'Item Name',
          type_id: 1,
          sell_price: 10.2,
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
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'Item Name',
          type_id: 1,
          sell_price: 10.2,
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

      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'Item Name',
          type_id: 1,
          sell_price: 10.2,
          cost_price: 20.2,
          sell_account_id: account.id,
          cost_account_id: anotherAccount.id,
          category_id: itemCategory.id,
        });

      expect(res.status).equals(200);
    });
  });

  describe('POST: `items/:id`', () => {
    it('Should response item not found in case item id was not exist.', async () => {
      const res = await request()
        .post('/api/items/100')
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'Item Name',
          type: 'product',
          cost_price: 100,
          sell_price: 200,
          sell_account_id: 1,
          cost_account_id: 2,
          category_id: 2,
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ITEM.NOT.FOUND', code: 100,
      });
    });

    it('Should `name` be required.', async () => {
      const item = await create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'name', location: 'body',
      });
    });

    it('Should `type` be required.', async () => {
      const item = await create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'type', location: 'body',
      });
    });

    it('Should `sell_price` be numeric.', async () => {
      const item = await create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          sell_price: 'not_numeric',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({ 
        value: 'not_numeric',
        msg: 'Invalid value',
        param: 'sell_price',
        location: 'body',
      });
    });

    it('Should `cost_price` be numeric.', async () => {
      const item = await create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          cost_price: 'not_numeric',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({ 
        value: 'not_numeric',
        msg: 'Invalid value',
        param: 'cost_price',
        location: 'body',
      });
    });

    it('Should `sell_account_id` be integer.', async () => {
      const item = await create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          sell_account_id: 'not_numeric',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        value: 'not_numeric',
        msg: 'Invalid value',
        param: 'sell_account_id',
        location: 'body',
      });
    });

    it('Should `cost_account_id` be integer.', async () => {
      const item = await create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          cost_account_id: 'not_numeric',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        value: 'not_numeric',
        msg: 'Invalid value',
        param: 'cost_account_id',
        location: 'body',
      });
    });

    it('Should response bad request in case cost account was not exist.', async () => {
      const item = await create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'Item Name',
          type: 'service',
          sell_price: 10.2,
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
      const item = await create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'Item Name',
          type: 'product',
          sell_price: 10.2,
          cost_price: 20.2,
          sell_account_id: 10,
          cost_account_id: 20,
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'SELL_ACCOUNT_NOT_FOUND', code: 120,
      });
    });

    it('Should update details of the given item.', async () => {
      const account = await create('account');
      const anotherAccount = await create('account');
      const itemCategory = await create('item_category');

      const item = await create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          name: 'New Item Name',
          type: 'service',
          sell_price: 10.2,
          cost_price: 20.2,
          sell_account_id: account.id,
          cost_account_id: anotherAccount.id,
          category_id: itemCategory.id,
        });

      const updatedItem = await Item.query().findById(item.id);

      expect(updatedItem.name).equals('New Item Name');
      expect(updatedItem.type).equals('service');
      expect(updatedItem.sellPrice).equals(10.2);
      expect(updatedItem.costPrice).equals(20.2);
      expect(updatedItem.sellAccountId).equals(account.id);
      expect(updatedItem.costAccountId).equals(anotherAccount.id);
      expect(updatedItem.categoryId).equals(itemCategory.id);
    });
  });

  describe('DELETE: `items/:id`', () => {
    it('Should response not found in case the item was not exist.', async () => {
      const res = await request()
        .delete('/api/items/10')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(404);
    });

    it('Should response success in case was exist.', async () => {
      const item = await create('item');
      const res = await request()
        .delete(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(200);
    });

    it('Should delete the given item from the storage.', async () => {
      const item = await create('item');
      await request()
        .delete(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      const storedItems = await Item.query().where('id', item.id);
      expect(storedItems).to.have.lengthOf(0);
    });
  });
});
