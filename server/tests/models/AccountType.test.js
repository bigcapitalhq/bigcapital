import { create, expect } from '~/testInit';
import '@/models/Account';
import AccountType from '@/models/AccountType';

describe('Model: AccountType', () => {
  it('Shoud account type model has many associated accounts.', async () => {
    const accountType = await create('account_type');
    await create('account', { account_type_id: accountType.id });
    await create('account', { account_type_id: accountType.id });

    const accountTypeModel = await AccountType.query().where('id', accountType.id).first();
    const typeAccounts = await accountTypeModel.$relatedQuery('accounts');

    expect(typeAccounts.length).equals(2);
  });
});
