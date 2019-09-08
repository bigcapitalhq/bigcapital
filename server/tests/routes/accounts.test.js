import { request, expect, create } from '~/testInit';
import knex from '@/database/knex';

describe('routes: /accounts/', () => {
  describe('POST `/accounts`', () => {
    it('Should `name` be required.', async () => {
      const res = await request().post('/api/accounts').send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `account_type_id` be required.', async () => {
      const res = await request().post('/api/accounts').send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should max length of `code` be limited.', async () => {
      const res = await request().post('/api/accounts').send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should response type not found in case `account_type_id` was not exist.', async () => {
      const res = await request().post('/api/accounts').send();

      expect(res.status).equals(422);
    });

    it('Should account code be unique in the storage.', async () => {
      const account = await create('account');
      const res = await request().post('/api/accounts').send({
        ...account,
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PARENT_CATEGORY_NOT_FOUND', code: 100,
      });
    });

    it('Should response success with correct data form.', async () => {
      const account = await create('account');
      const res = await request().post('/api/accounts').send({
        name: 'Name',
        description: 'description here',
        account_type_id: account.account_type_id,
        parent_account_id: account.id,
      });

      expect(res.status).equals(200);
    });

    it('Should store account data in the storage.', async () => {

    });
  });

  describe('POST `/accounts/:id`', () => {
    it('Should `name` be required.', async () => {
      const account = await create('account');
      const res = await request().post(`/api/accounts/${account.id}`).send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `account_type_id` be required.', async () => {
      const account = await create('account');
      const res = await request().post(`/api/accounts/${account.id}`).send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should max length of `code` be limited.', async () => {
      const account = await create('account');
      const res = await request().post(`/api/accounts/${account.id}`).send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should response type not found in case `account_type_id` was not exist.', async () => {
      const res = await request().post('/api/accounts').send();

      expect(res.status).equals(422);
    });

    it('Should account code be unique in the storage.', async () => {
      const account = await create('account', { code: 'ABCD' });
      const res = await request().post(`/api/accounts/${account.id}`).send({
        // code: ',
        ...account,
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'NOT_UNIQUE_CODE', code: 100,
      });
    });

    it('Should response success with correct data form.', async () => {
      const account = await create('account');
      const res = await request().post('/api/accounts').send({
        name: 'Name',
        description: 'description here',
        account_type_id: account.account_type_id,
        parent_account_id: account.id,
      });

      expect(res.status).equals(200);
    });
  });

  describe('GET: `/accounts`', () => {

  });

  describe('DELETE: `/accounts`', () => {
    it('Should response not found in case account was not exist.', async () => {
      const res = await request().delete('/api/accounts/10').send();

      expect(res.status).equals(404);
    });

    it('Should delete the give account from the storage.', async () => {
      const account = await create('account');
      await request().delete(`/api/accounts/${account.id}`);

      const foundAccounts = await knex('accounts').where('id', account.id);
      expect(foundAccounts).to.have.lengthOf(1);
    });
  });
});
