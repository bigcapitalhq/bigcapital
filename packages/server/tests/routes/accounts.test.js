import {
  request,
  expect,
} from '~/testInit';
import Account from 'models/Account';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('routes: /accounts/', () => {
  describe('POST `/accounts`', () => {
    it('Should `name` be required.', async () => {
      const res = await request()
        .post('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `account_type_id` be required.', async () => {
      const res = await request()
        .post('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should max length of `code` be limited.', async () => {
      const res = await request()
        .post('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should response type not found in case `account_type_id` was not exist.', async () => {
      const account = await tenantFactory.create('account');
      const res = await request()
        .post('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Account Name',
          description: account.description,
          account_type_id: 22, // not found.
          code: 123,
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'NOT_EXIST_ACCOUNT_TYPE', code: 200,
      });
    });

    it('Should account code be unique in the storage.', async () => {
      const account = await tenantFactory.create('account');
      const res = await request()
        .post('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: account.name,
          description: account.description,
          account_type_id: account.accountTypeId,
          code: account.code,
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'NOT_UNIQUE_CODE', code: 100,
      });
    });

    it('Should response success with correct data form.', async () => {
      const account = await tenantFactory.create('account');
      const res = await request()
        .post('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Name',
          description: 'description here',
          code: 100,
          account_type_id: account.accountTypeId,
          parent_account_id: account.id,
        });

      expect(res.status).equals(200);
    });

    it('Should store account data in the storage.', async () => {
      const account = await tenantFactory.create('account');

      const res = await request().post('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Account Name',
          description: 'desc here',
          account_type_id: account.accountTypeId,
          parent_account_id: account.id,
        });

      const accountModel = await Account.tenant().query()
        .where('name', 'Account Name')
        .first();

      expect(accountModel).a.an('object');
      expect(accountModel.description).equals('desc here');
      expect(accountModel.accountTypeId).equals(account.accountTypeId);
      expect(accountModel.parentAccountId).equals(account.id);
    });
  });

  describe('POST `/accounts/:id`', () => {
    it('Should `name` be required.', async () => {
      const account = await tenantFactory.create('account');
      const res = await request()
        .post(`/api/accounts/${account.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `account_type_id` be required.', async () => {
      const account = await tenantFactory.create('account');
      const res = await request()
        .post(`/api/accounts/${account.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should max length of `code` be limited.', async () => {
      const account = await tenantFactory.create('account');
      const res = await request()
        .post(`/api/accounts/${account.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should response type not found in case `account_type_id` was not exist.', async () => {
      const res = await request()
        .post('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
    });

    it('Should account code be unique in the storage.', async () => {
      await tenantFactory.create('account', { code: 'ABCD' });
      const account = await tenantFactory.create('account');
      const res = await request()
        .post(`/api/accounts/${account.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'name',
          code: 'ABCD',
          account_type_id: account.accountTypeId,
        });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'NOT_UNIQUE_CODE', code: 100,
      });
    });

    it('Should response success with correct data form.', async () => {
      const account = await tenantFactory.create('account');
      const res = await request()
        .post('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'Name',
          description: 'description here',
          account_type_id: account.accountTypeId,
          parent_account_id: account.id,
          code: '123',
        });

      expect(res.status).equals(200);
    });
  });

  describe('GET: `/accounts`', () => {
    it('Should retrieve chart of accounts', async () => {
      await tenantFactory.create('resource', { name: 'accounts' });
      const account = await tenantFactory.create('account');
      await tenantFactory.create('account', { parent_account_id: account.id });

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);
      expect(res.body.accounts.length).above(0);
    });

    it('Should retrieve accounts based on view roles conditionals of the custom view.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });
      
      const accountTypeField = await tenantFactory.create('resource_field', {
        label_name: 'Account type',
        key: 'type',
        resource_id: resource.id,
        active: true,
        predefined: true,
      });

      const accountNameField = await tenantFactory.create('resource_field', {
        label_name: 'Account Name',
        key: 'name',
        resource_id: resource.id,
        active: true,
        predefined: true,
      });
      const accountsView = await tenantFactory.create('view', {
        name: 'Accounts View',
        resource_id: resource.id,
        roles_logic_expression: '1 AND 2',
      });
      const accountType = await tenantFactory.create('account_type');

      await tenantFactory.create('view_role', {
        view_id: accountsView.id,
        index: 1,
        field_id: accountTypeField.id,
        value: accountType.name,
        comparator: 'equals',
      });
      await tenantFactory.create('view_role', {
        view_id: accountsView.id,
        index: 2,
        field_id: accountNameField.id,
        value: 'account',
        comparator: 'contains',
      });

      await tenantFactory.create('account', { name: 'account-1', account_type_id: accountType.id });
      await tenantFactory.create('account', { name: 'account-2', account_type_id: accountType.id });
      await tenantFactory.create('account', { name: 'account-3' });

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          custom_view_id: accountsView.id
        })
        .send();

      expect(res.body.accounts.length).equals(2);
      expect(res.body.accounts[0].name).equals('account-1');
      expect(res.body.accounts[1].name).equals('account-2');
      expect(res.body.accounts[0].account_type_id).equals(accountType.id);
      expect(res.body.accounts[1].account_type_id).equals(accountType.id); 
    });

    it('Should retrieve accounts based on view roles conditionals with relation join column.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });
      
      const accountTypeField = await tenantFactory.create('resource_field', {
        label_name: 'Account type',
        key: 'type',
        resource_id: resource.id,
        active: true,
        predefined: true,
      });
      const accountsView = await tenantFactory.create('view', {
        name: 'Accounts View',
        resource_id: resource.id,
        roles_logic_expression: '1',
      });

      const accountType = await tenantFactory.create('account_type');
      const accountsViewRole = await tenantFactory.create('view_role', {
        view_id: accountsView.id,
        index: 1,
        field_id: accountTypeField.id,
        value: accountType.name,
        comparator: 'equals',
      });

      await tenantFactory.create('account', { account_type_id: accountType.id });
      await tenantFactory.create('account');
      await tenantFactory.create('account');

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          custom_view_id: accountsView.id
        })
        .send();

      expect(res.body.accounts.length).equals(1);
      expect(res.body.accounts[0].account_type_id).equals(accountType.id);
    });

    it('Should retrieve accounts and child accounts in nested set graph.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });

      const account1 = await tenantFactory.create('account');
      const account2 = await tenantFactory.create('account', { parent_account_id: account1.id });
      const account3 = await tenantFactory.create('account', { parent_account_id: account2.id });

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);

      const foundAccount = res.body.accounts.find(a => a.id === account1.id);

      expect(foundAccount.id).equals(account1.id);
      expect(foundAccount.children[0].id).equals(account2.id);
      expect(foundAccount.children[0].children[0].id).equals(account3.id);
    });

    it('Should retrieve bad request when `filter_roles.*.comparator` not associated to `field_key`.', () => {

    });

    it('Should retrieve bad request when `filter_roles.*.field_key` not found in accounts resource.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });

      const account1 = await tenantFactory.create('account', { name: 'ahmed' });
      const account2 = await tenantFactory.create('account');
      const account3 = await tenantFactory.create('account');

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          stringified_filter_roles: JSON.stringify([{
            condition: 'AND',
            field_key: 'not_found',
            comparator: 'equals',
            value: 'ahmed',
          }, { 
            condition: 'AND',
            field_key: 'mybe_found',
            comparator: 'equals',
            value: 'ahmed',
          }]),
        });

      expect(res.body.errors).include.something.that.deep.equals({
        type: 'ACCOUNTS.RESOURCE.HAS.NO.GIVEN.FIELDS', code: 500,
      });
    });

    it('Should retrieve bad request when `filter_roles.*.condition` is invalid.', async () => {

    });

    it('Should retrieve filtered accounts according to the given account type filter condition.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });
      const keyField = await tenantFactory.create('resource_field', {
        key: 'type',
        resource_id: resource.id,
      });
      const nameFiled = await tenantFactory.create('resource_field', {
        key: 'name',
        resource_id: resource.id,
      });
      const accountType = await tenantFactory.create('account_type');

      const account1 = await tenantFactory.create('account', {
        name: 'ahmed',
        account_type_id: accountType.id
      });
      const account2 = await tenantFactory.create('account');
      const account3 = await tenantFactory.create('account');

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          stringified_filter_roles: JSON.stringify([{
            condition: '&&',
            field_key: 'type',
            comparator: 'equals',
            value: accountType.name,
          }, {
            condition: '&&',
            field_key: 'name',
            comparator: 'equals',
            value: 'ahmed', 
          }]),
        });

      expect(res.body.accounts.length).equals(1);
    });

    it('Should retrieve filtered accounts according to the given account description filter condition.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });
      const resourceField = await tenantFactory.create('resource_field', {
        key: 'description',
        resource_id: resource.id,
      });

      const account1 = await tenantFactory.create('account', { name: 'ahmed', description: 'here' });
      const account2 = await tenantFactory.create('account');
      const account3 = await tenantFactory.create('account');

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          stringified_filter_roles: JSON.stringify([{
            condition: 'AND',
            field_key: resourceField.key,
            comparator: 'contain',
            value: 'here',
          }]),
        });

      expect(res.body.accounts.length).equals(1);
      expect(res.body.accounts[0].description).equals('here');
    });

    it('Should retrieve filtered accounts based on given filter roles between OR conditions.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });
      const resourceField = await tenantFactory.create('resource_field', {
        key: 'description',
        resource_id: resource.id,
      });

      const resourceCodeField = await tenantFactory.create('resource_field', {
        key: 'code',
        resource_id: resource.id,
      });

      const account1 = await tenantFactory.create('account', { name: 'ahmed', description: 'target' });
      const account2 = await tenantFactory.create('account', { description: 'target' });
      const account3 = await tenantFactory.create('account');

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          stringified_filter_roles: JSON.stringify([{
            condition: '&&',
            field_key: resourceField.key,
            comparator: 'contain',
            value: 'target',
          }, {
            condition: '||',
            field_key: resourceCodeField.key,
            comparator: 'equals',
            value: 'ahmed',
          }]),
        });

      expect(res.body.accounts.length).equals(2);
      expect(res.body.accounts[0].description).equals('target');
      expect(res.body.accounts[1].description).equals('target');
      expect(res.body.accounts[0].name).equals('ahmed');
    });

    it('Should retrieve filtered accounts from custom view and filter roles.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });
      const accountTypeField = await tenantFactory.create('resource_field', {
        key: 'type', resource_id: resource.id,
      });
      const accountDescriptionField = await tenantFactory.create('resource_field', {
        key: 'description', resource_id: resource.id,
      });

      const accountType = await tenantFactory.create('account_type', { name: 'type-name' });

      const account1 = await tenantFactory.create('account', { name: 'ahmed-1' });
      const account2 = await tenantFactory.create('account', { name: 'ahmed-2', account_type_id: accountType.id, description: 'target' });
      const account3 = await tenantFactory.create('account', { name: 'ahmed-3' });

      const accountsView = await tenantFactory.create('view', {
        name: 'Accounts View',
        resource_id: resource.id,
        roles_logic_expression: '1',
      });
      const accountsViewRole = await tenantFactory.create('view_role', {
        view_id: accountsView.id,
        field_id: accountTypeField.id,
        index: 1,
        value: 'type-name',
        comparator: 'equals',
      });

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          custom_view_id: accountsView.id,
          stringified_filter_roles: JSON.stringify([{
            condition: 'AND',
            field_key: 'description',
            comparator: 'contain',
            value: 'target',
          }]),
        });

      expect(res.body.accounts.length).equals(1);
      expect(res.body.accounts[0].name).equals('ahmed-2');
      expect(res.body.accounts[0].description).equals('target');
    });

    it('Should validate the given `column_sort_order` column on the accounts resource.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });
      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({ 
          column_sort_by: 'not_found',
          sort_order: 'desc',
        });
      
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'COLUMN.SORT.ORDER.NOT.FOUND', code: 300,
      });
    });

    it('Should sorting the given `column_sort_order` column on asc direction,', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });
      const resourceField = await tenantFactory.create('resource_field', {
        key: 'name', resource_id: resource.id,
      });
      const accounts1 = await tenantFactory.create('account', { name: 'A' });
      const accounts2 = await tenantFactory.create('account', { name: 'B' });

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          column_sort_by: 'name',
          sort_order: 'asc',
        });

      const AAccountIndex = res.body.accounts.findIndex(a => a.name === 'B');
      const BAccountIndex = res.body.accounts.findIndex(a => a.name === 'A');
      
      expect(AAccountIndex).above(BAccountIndex);
    });

    it('Should sorting the given `column_sort_order` column with relation on another table on asc direction.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'accounts' });
      const resourceField = await tenantFactory.create('resource_field', {
        key: 'type', resource_id: resource.id,
      });
      const accounts1 = await tenantFactory.create('account', { name: 'A' });
      const accounts2 = await tenantFactory.create('account', { name: 'B' });

      const res = await request()
        .get('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          column_sort_by: 'name',
          sort_order: 'asc',
        });

      expect(res.body.accounts[0].name).equals('A');
      expect(res.body.accounts[1].name).equals('B');
    });
  });

  describe('DELETE: `/accounts`', () => {
    it('Should response not found in case account was not exist.', async () => {
      const res = await request()
        .delete('/api/accounts/10')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
    });

    it('Should delete the give account from the storage.', async () => {
      const account = await tenantFactory.create('account');
      await request()
        .delete(`/api/accounts/${account.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      const foundAccounts = await Account.tenant().query().where('id', account.id);
      expect(foundAccounts).to.have.lengthOf(0);
    });

    it('Should not delete the given account in case account has associated transactions.', async () => {
      const accountTransaction = await tenantFactory.create('account_transaction');

      const res = await request()
        .delete(`/api/accounts/${accountTransaction.accountId}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS', code: 100,
      });
    });
  });

  describe('DELETE: `/accounts?ids=`', () => {
    it('Should response in case on of accounts ids was not exists.', async () => {
      const res = await request()
        .delete('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [100, 200],
        })
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'ACCOUNTS.IDS.NOT.FOUND', code: 200, ids: [100, 200],
      });
    });

    it('Should response bad request in case one of accounts has transactions.', async () => {
      const accountTransaction = await tenantFactory.create('account_transaction');
      const accountTransaction2 = await tenantFactory.create('account_transaction');

      const res = await request()
        .delete('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [accountTransaction.accountId, accountTransaction2.accountId],
        })
        .send();

      expect(res.body.errors).include.something.that.deep.equals({
        type: 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS',
        code: 300,
        ids: [accountTransaction.accountId, accountTransaction2.accountId],
      });
    });

    it('Should delete the given accounts from the storage.', async () => {
      const account1 = await tenantFactory.create('account');
      const account2 = await tenantFactory.create('account');

      const res = await request()
        .delete('/api/accounts')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [account1.id, account2.id],
        })
        .send();

      expect(res.status).equals(200);

      const foundAccounts = await Account.tenant().query()
        .whereIn('id', [account1.id, account2.id]);

      expect(foundAccounts.length).equals(0);
    });
  });

  describe('POST: `/api/accounts/bulk/activate|inactivate', () => {
    it('Should response if there one of accounts ids were not found.', async () => {
      const res = await request()
        .post('/api/accounts/bulk/activate')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [123123, 321321],
        })
        .send();

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'ACCOUNTS.NOT.FOUND', code: 200,
      });
    });

    it('Should activate all the given accounts.', async () => {
      const accountA = await tenantFactory.create('account', { active: 1 });
      const accountB = await tenantFactory.create('account', { active: 1 });
      
      const res = await request()
        .post('/api/accounts/bulk/inactivate')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [accountA.id, accountB.id],
        })
        .send();

      const updatedAccounts = await Account.tenant().query().whereIn('id', [accountA.id, accountB.id]);

      expect(updatedAccounts[0].active).equals(0);
      expect(updatedAccounts[1].active).equals(0);
    });

    it('Should inactivate all the given accounts.', async () => {
      const accountA = await tenantFactory.create('account', { active: 0 });
      const accountB = await tenantFactory.create('account', { active: 0 });
      
      const res = await request()
        .post('/api/accounts/bulk/activate')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({
          ids: [accountA.id, accountB.id],
        })
        .send();

      const updatedAccounts = await Account.tenant().query().whereIn('id', [accountA.id, accountB.id]);

      expect(updatedAccounts[0].active).equals(1);
      expect(updatedAccounts[1].active).equals(1);
    });
  });
});
