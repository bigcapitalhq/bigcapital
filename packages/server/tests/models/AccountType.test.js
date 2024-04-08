import 'models/Account';
import { tenantFactory } from '~/dbInit';
import { expect } from '~/testInit';
import AccountType from '../models/AccountType';

describe('Model: AccountType', () => {
  it('Shoud account type model has many associated accounts.', async () => {
    const accountType = await tenantFactory.create('account_type');
    await tenantFactory.create('account', { account_type_id: accountType.id });
    await tenantFactory.create('account', { account_type_id: accountType.id });

    const accountTypeModel = await AccountType.tenant().query().where('id', accountType.id).first();
    const typeAccounts = await accountTypeModel.$relatedQuery('accounts');

    expect(typeAccounts.length).equals(2);
  });
});
