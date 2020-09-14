import {
  request,
  expect,
} from '~/testInit';
import Item from 'models/Item';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('routes: `/items`', () => {
  describe('POST: `/items`', () => {
    it('Should not create a new item if the user was not authorized.', async () => {
      const res = await request()
        .post('/api/items')
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should `name` be required.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'name', location: 'body',
      });
    });

    it('Should `type` be required.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'type', location: 'body',
      });
    });

    it('Should `type` be one of defined words.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          type: 'not-defined',
        });

      expect(res.body.errors).include.something.deep.equals({
        value: 'not-defined',
        msg: 'Invalid value',
        param: 'type',
        location: 'body',
      });
    });

    it('Should `buy_price` be numeric.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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

    it('Should `sell_price` be numeric.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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

    it('Should `sell_account_id` be integer.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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

    it('Should `cost_account_id` be integer.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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

    it('Should `cost_account_id` be required if `cost_price` was presented.', async () => {

    });

    it('Should `buy_account_id` be required if `buy_price` was presented.', async () => {

    });

    it('Should `inventory_account_id` be required if type was `inventory` item.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Item Name',
          type: 'inventory',
          sell_price: 10.2,
          cost_price: 20.2,
          sell_account_id: 10,
          cost_account_id: 20,
        });

      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'inventory_account_id',
        location: 'body',
      });
    });

    it('Should `inventory_account_id` be not required if type was not `inventory`.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Item Name',
          type: 'service',
          sell_price: 10.2,
          cost_price: 20.2,
          sell_account_id: 10,
          cost_account_id: 20,
        });

      expect(res.body.errors).include.something.deep.not.equals({
        msg: 'Invalid value',
        param: 'inventory_account_id',
        location: 'body',
      });
    });

    it('Should response bad request in case `cost account` was not exist.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
        type: 'SELL_ACCOUNT_NOT_FOUND', code: 120,
      });
    });

    it('Should response not category found in case item category was not exist.', async () => {
      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Item Name',
          type: 'service',
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
      const account = await tenantFactory.create('account');
      const anotherAccount = await tenantFactory.create('account');
      const itemCategory = await tenantFactory.create('item_category');

      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Item Name',
          type: 'service',
          sell_price: 10.2,
          cost_price: 20.2,
          sell_account_id: account.id,
          cost_account_id: anotherAccount.id,
          category_id: itemCategory.id,
        });

      expect(res.status).equals(200);
    });

    it('Should store the given item details to the storage.', async () => {
      const account = await tenantFactory.create('account');
      const anotherAccount = await tenantFactory.create('account');
      const itemCategory = await tenantFactory.create('item_category');

      const res = await request()
        .post('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Item Name',
          type: 'service',
          sku: 'SKU CODE',
          sell_price: 10.2,
          cost_price: 20.2,
          sell_account_id: account.id,
          cost_account_id: anotherAccount.id,
          category_id: itemCategory.id,
          note: 'note about item'
        });

      const storedItem = await Item.tenant().query().where('id', res.body.id).first();

      expect(storedItem.name).equals('Item Name');
      expect(storedItem.type).equals('service');

      expect(storedItem.sellPrice).equals(10.2);
      expect(storedItem.costPrice).equals(20.2);
      expect(storedItem.sellAccountId).equals(account.id);
      expect(storedItem.costAccountId).equals(anotherAccount.id);
      expect(storedItem.categoryId).equals(itemCategory.id);
      expect(storedItem.sku).equals('SKU CODE');
      expect(storedItem.note).equals('note about item');
      expect(storedItem.userId).is.not.null;
    });
  });

  describe('POST: `items/:id`', () => {
    it('Should response item not found in case item id was not exist.', async () => {
      const res = await request()
        .post('/api/items/100')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const item = await tenantFactory.create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'name', location: 'body',
      });
    });

    it('Should `type` be required.', async () => {
      const item = await tenantFactory.create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'type', location: 'body',
      });
    });

    it('Should `sell_price` be numeric.', async () => {
      const item = await tenantFactory.create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const item = await tenantFactory.create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const item = await tenantFactory.create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const item = await tenantFactory.create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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

    it ('Should response bad request in case cost account was not exist.', async () => {
      const item = await tenantFactory.create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
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
      const item = await tenantFactory.create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Item Name',
          type: 'product',
          sell_price: 10.2,
          cost_price: 20.2,
          sell_account_id: 1000000,
          cost_account_id: 1000000,
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'SELL_ACCOUNT_NOT_FOUND', code: 120,
      });
    });

    it('Should update details of the given item.', async () => {
      const account = await tenantFactory.create('account');
      const anotherAccount = await tenantFactory.create('account');
      const itemCategory = await tenantFactory.create('item_category');

      const item = await tenantFactory.create('item');
      const res = await request()
        .post(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'New Item Name',
          type: 'service',
          sell_price: 10.2,
          cost_price: 20.2,
          sell_account_id: account.id,
          cost_account_id: anotherAccount.id,
          category_id: itemCategory.id,
        });

      const updatedItem = await Item.tenant().query().findById(item.id);

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
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
    });

    it('Should response success in case was exist.', async () => {
      const item = await tenantFactory.create('item');
      const res = await request()
        .delete(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);
    });

    it('Should delete the given item from the storage.', async () => {
      const item = await tenantFactory.create('item');
      await request()
        .delete(`/api/items/${item.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const storedItems = await Item.tenant().query().where('id', item.id);
      expect(storedItems).to.have.lengthOf(0);
    });
  });

  describe('DELETE: `items?ids=`', () => {
    it('Should response in case one of items ids where not exists.', async () => {
      const res = await request()
        .delete('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [100, 200],
        })
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'ITEMS.NOT.FOUND', code: 200, ids: [100, 200],
      });
    });

    it('Should delete the given items from the storage.', async () => {
      const item1 = await tenantFactory.create('item');
      const item2 = await tenantFactory.create('item');

      const res = await request()
        .delete('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [item1.id, item2.id],
        })
        .send();

      const foundItems = await Item.tenant().query();

      expect(res.status).equals(200);
      expect(foundItems.length).equals(0)
    });
  });

  describe('GET: `items`', () => {
    it('Should response unauthorized access in case the user not authenticated.', async () => {
      const res = await request()
        .get('/api/items')
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should retrieve items list with associated accounts.', async () => {
      await tenantFactory.create('resource', { name: 'items' });
      await tenantFactory.create('item');

      const res = await request()
        .get('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);

      expect(res.body.items).to.be.a('object');
      expect(res.body.items.results).to.be.a('array');
      expect(res.body.items.results.length).equals(1);

      expect(res.body.items.results[0].cost_account).to.be.an('object');
      expect(res.body.items.results[0].sell_account).to.be.an('object');
      expect(res.body.items.results[0].inventory_account).to.be.an('object');
      expect(res.body.items.results[0].category).to.be.an('object');
    });

    it('Should retrieve ordered items based on the given `column_sort_order` and `sort_order` query.', async () => {
      await tenantFactory.create('item', { name: 'ahmed' });
      await tenantFactory.create('item', { name: 'mohamed' });

      const res = await request()
        .get('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          column_sort_order: 'name',
          sort_order: 'desc',
        })
        .send();

      expect(res.body.items.results.length).equals(2);
      expect(res.body.items.results[0].name).equals('mohamed');
      expect(res.body.items.results[1].name).equals('ahmed');
    });

    it('Should retrieve pagination meta of items list.', async () => {
      await tenantFactory.create('resource', { name: 'items' });

      const res = await request()
        .get('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.body.items.results).to.be.a('array');
      expect(res.body.items.results.length).equals(0);
      expect(res.body.items.pagination).to.be.a('object');
      expect(res.body.items.pagination.total).to.be.a('number');
      expect(res.body.items.pagination.total).equals(0)
    });

    it('Should retrieve filtered items based on custom view conditions.', async () => {
      const item1 = await tenantFactory.create('item', { type: 'service' });
      const item2 = await tenantFactory.create('item', { type: 'service' });
      const item3 = await tenantFactory.create('item', { type: 'inventory' });
      const item4 = await tenantFactory.create('item', { type: 'inventory' });

      const view = await tenantFactory.create('view', {
        name: 'Items Inventory',
        resource_id: 2,
        roles_logic_expression: '1',
      });
      const viewCondition = await tenantFactory.create('view_role', {
        view_id: view.id,
        index: 1,
        field_id: 12,
        value: 'inventory',
        comparator: 'equals',
      });
      const res = await request()
        .get('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          custom_view_id: view.id,
        })
        .send();

      expect(res.body.customViewId).equals(view.id);
      expect(res.body.viewColumns).to.be.a('array');
      expect(res.body.viewConditions).to.be.a('array');
      expect(res.body.items.results.length).equals(2);
      expect(res.body.items.results[0].type).equals('inventory');
      expect(res.body.items.results[1].type).equals('inventory');
    });

    it('Should retrieve filtered items based on filtering conditions.', async () => {
      const item1 = await tenantFactory.create('item', { type: 'service' });
      const item2 = await tenantFactory.create('item', { type: 'service', name: 'target' });
      const item3 = await tenantFactory.create('item', { type: 'inventory' });
      const item4 = await tenantFactory.create('item', { type: 'inventory' });

      const res = await request()
        .get('/api/items')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          stringified_filter_roles: JSON.stringify([
            {
              condition: 'AND',
              field_key: 'type',
              comparator: 'equals',
              value: 'inventory',
            },
            {
              condition: 'OR',
              field_key: 'name',
              comparator: 'equals',
              value: 'target',
            },
          ]),
        })
        .send();

      expect(res.body.items.results.length).equals(3);
      expect(res.body.items.results[0].name).equals('target');
      expect(res.body.items.results[1].type).equals('inventory');
      expect(res.body.items.results[2].type).equals('inventory');
    });
  });
});
