import {
  request,
  expect,
} from '~/testInit';
import ItemCategory from 'models/ItemCategory';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';

describe('routes: /item_categories/', () => {
  describe('POST `/items_categories``', async () => {
    it('Should not create a item category if the user was not authorized.', async () => {
      const res = await request().post('/api/item_categories').send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should `name` be required.', async () => {
      const res = await request()
        .post('/api/item_categories')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `parent_category_id` be exist in the storage.', async () => {
      const res = await request()
        .post('/api/item_categories')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Clothes',
          parent_category_id: 10,
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PARENT_CATEGORY_NOT_FOUND', code: 100,
      });
    });

    it('Should response success with correct form data.', async () => {
      const res = await request()
        .post('/api/item_categories')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Clothes',
          description: 'Here is description',
        });

      expect(res.status).equals(200);
      expect(res.body.category).to.be.a('object');
      expect(res.body.category.id).to.be.a('number');
      expect(res.body.category.name).to.be.a('string');
      expect(res.body.category.description).to.be.a('string');
    });

    it('Should item category data be saved to the storage.', async () => {
      const category = await tenantFactory.create('item_category');
      const res = await request()
        .post('/api/item_categories')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Clothes',
          description: 'Here is description',
          parent_category_id: category.id,
        });

      expect(res.status).equals(200);

      const storedCategory = await ItemCategory.tenant().query()
        .where('id', res.body.category.id)
        .first();

      expect(storedCategory.name).equals('Clothes');
      expect(storedCategory.description).equals('Here is description');
      expect(storedCategory.parentCategoryId).equals(category.id);
      expect(storedCategory.userId).to.be.a('number');
    });
  });

  describe('POST `/items_category/{id}`', () => {
    it('Should not update a item category if the user was not authorized.', async () => {
      const category = await tenantFactory.create('item_category');
      const res = await request()
        .post(`/api/item_categories/${category.id}`)
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should `name` be required.', async () => {
      const category = await tenantFactory.create('item_category');
      const res = await request()
        .post(`/api/item_categories/${category.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `parent_category_id` be exist in the storage.', async () => {
      const category = await tenantFactory.create('item_category');
      const res = await request()
        .post(`/api/item_categories/${category.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Name',
          parent_category_id: 10,
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PARENT_CATEGORY_NOT_FOUND', code: 100,
      });
    });

    it('Should response success with correct data format.', async () => {
      const category = await tenantFactory.create('item_category');
      const anotherCategory = await tenantFactory.create('item_category');

      const res = await request()
        .post(`/api/item_categories/${category.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Name',
          parent_category_id: anotherCategory.id,
          description: 'updated description',
        });

      expect(res.status).equals(200);
    });

    it('Should item category data be update in the storage.', async () => {
      const category = await tenantFactory.create('item_category');
      const anotherCategory = await tenantFactory.create('item_category');

      const res = await request()
        .post(`/api/item_categories/${category.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Name',
          parent_category_id: anotherCategory.id,
          description: 'updated description',
        });

      const storedCategory = await ItemCategory.tenant().query()
        .where('id', res.body.id)
        .first();

      expect(storedCategory.name).equals('Name');
      expect(storedCategory.description).equals('updated description');
      expect(storedCategory.parentCategoryId).equals(anotherCategory.id);
    });
  });

  describe('DELETE: `/items_categories`', async () => {
    it('Should not delete the give item category if the user was not authorized.', async () => {
      const category = await tenantFactory.create('item_category');

      const res = await request()
        .delete(`/api/item_categories/${category.id}`)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should not delete if the item category was not found.', async () => {
      const res = await request()
        .delete('/api/item_categories/10')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
    });

    it('Should response success after delete the given item category.', async () => {
      const category = await tenantFactory.create('item_category');
      const res = await request()
        .delete(`/api/item_categories/${category.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);
    });

    it('Should delete the give item category from the storage.', async () => {
      const category = await tenantFactory.create('item_category');
      const res = await request()
        .delete(`/api/item_categories/${category.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const categories = await ItemCategory.tenant().query()
        .where('id', category.id);

      expect(categories).to.have.lengthOf(0);
    });
  });

  describe('GET: `/item_categories`', () => {

    it('Should retrieve list of item categories.', async () => {
      const category1 = await tenantFactory.create('item_category');
      const category2 = await tenantFactory.create('item_category', { parent_category_id: category1.id });

      const res = await request()
        .get('/api/item_categories')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.body.categories).to.be.a('array');
      expect(res.body.categories.length).equals(2);
      
      expect(res.body.categories[0].id).to.be.a('number');
      expect(res.body.categories[0].name).to.be.a('string');
      expect(res.body.categories[0].parent_category_id).to.be.a('null');
      expect(res.body.categories[0].description).to.be.a('string');

      expect(res.body.categories[1].parent_category_id).to.be.a('number');
    });


    it('Should retrieve of related items.', async () => {
      const category1 = await tenantFactory.create('item_category');
      const category2 = await tenantFactory.create('item_category', { parent_category_id: category1.id });

      await tenantFactory.create('item', { category_id: category1.id });

      const res = await request()
        .get('/api/item_categories')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.body.categories[0].count).to.be.a('number');
      expect(res.body.categories[0].count).equals(1);
    });
  });

  describe('GET `/items_category/{id}', () => {
    it('Should response not found with incorrect item category ID.', () => {

    });

    it('Should response success with exist item category.', () => {

    });

    it('Should response data of item category.', () => {

    });
  });

  describe('DELETE: `/items_categories`', () => {
    it('Should response bad request in case one of item categories id not exists in the storage.', async () => {
      const res = await request()
        .delete('/api/item_categories/bulk')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [1020, 2020],
        })
        .send();

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.deep.equals({
        type: 'ITEM.CATEGORIES.IDS.NOT.FOUND', code: 200
      });
    });

    it('Should delete the given item categories.', async () => {
      const itemCategory = await tenantFactory.create('item_category');
      const itemCategory2 = await tenantFactory.create('item_category');

      const res = await request()
        .delete('/api/item_categories/bulk')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [itemCategory.id, itemCategory2.id],
        })
        .send();

      const deleteItemCategories = await ItemCategory.tenant().query()
        .whereIn('id', [itemCategory.id, itemCategory2.id]);

      expect(deleteItemCategories.length).equals(0);
    });
  });
});
