import { request, expect, create } from '~/testInit';
import knex from '@/database/knex';

describe('routes: /item_categories/', () => {
  describe('POST `/items_categories``', async () => {
    it('Should not create a item category if the user was not authorized.', () => {

    });

    it('Should `name` be required.', async () => {
      const res = await request().post('/api/item_categories').send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `parent_category_id` be exist in the storage.', async () => {
      const res = await request().posjt('/api/item_categories').send({
        name: 'Clothes',
        parent_category_id: 10,
      });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PARENT_CATEGORY_NOT_FOUND', code: 100,
      });
    });

    it('Should response success with correct form data.', async () => {
      const res = await request().post('/api/item_categories').send({
        name: 'Clothes',
        description: 'Here is description',
      });

      // eslint-disable-next-line no-unused-expressions
      expect(res.body.id).to.exist;
      expect(res.status).equals(200);
    });

    it('Should item category data be saved to the storage.', async () => {
      const category = await create('item_category');
      const res = await request().post('/api/item_categories').send({
        name: 'Clothes',
        description: 'Here is description',
        parent_category_id: category.id,
      });

      // eslint-disable-next-line no-unused-expressions
      expect(res.body.id).to.exist;

      const storedCategory = await knex('items_categories').where('id', res.body.id).first();

      expect(storedCategory.label).equals('Clothes');
      expect(storedCategory.description).equals('Here is description');
      expect(storedCategory.parent_category_id).equals(category.id);
    });
  });

  describe('POST `/items_category/{id}`', () => {
    it('Should not update a item category if the user was not authorized.', () => {

    });

    it('Should `name` be required.', async () => {
      const category = await create('item_category');
      const res = await request().post(`/api/item_categories/${category.id}`).send({
        name: '',
      });
      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `parent_category_id` be exist in the storage.', async () => {
      const category = await create('item_category');
      const res = await request().post(`/api/item_categories/${category.id}`).send({
        name: 'Name',
        parent_category_id: 10,
      });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PARENT_CATEGORY_NOT_FOUND', code: 100,
      });
    });

    it('Should response success with correct data format.', async () => {
      const category = await create('item_category');
      const anotherCategory = await create('item_category');

      const res = await request().post(`/api/item_categories/${category.id}`).send({
        name: 'Name',
        parent_category_id: anotherCategory.id,
        description: 'updated description',
      });

      expect(res.status).equals(200);
    });

    it('Should item category data be update in the storage.', async () => {
      const category = await create('item_category');
      const anotherCategory = await create('item_category');

      const res = await request().post(`/api/item_categories/${category.id}`).send({
        name: 'Name',
        parent_category_id: anotherCategory.id,
        description: 'updated description',
      });

      const storedCategory = await knex('items_categories').where('id', res.body.id).first();

      expect(storedCategory.label).equals('Name');
      expect(storedCategory.description).equals('updated description');
      expect(storedCategory.parent_category_id).equals(anotherCategory.id);
    });
  });

  describe('DELETE: `/items_categories`', async () => {
    it('Should not delete the give item category if the user was not authorized.', () => {

    });

    it('Should not delete if the item category was not found.', async () => {
      const res = await request().delete('/api/item_categories/10');

      expect(res.status).equals(404);
    });

    it('Should response success after delete the given item category.', async () => {
      const category = await create('item_category');

      const res = await request().delete(`/api/item_categories/${category.id}`);

      expect(res.status).equals(200);
    });

    it('Should delete the give item category from the storage.', async () => {
      const category = await create('item_category');
      await request().delete(`/api/item_categories/${category.id}`);

      const categories = await knex('items_categories').where('id', category.id);

      expect(categories).to.have.lengthOf(0);
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
});
