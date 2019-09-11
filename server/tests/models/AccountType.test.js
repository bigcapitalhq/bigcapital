import { create, expect } from '~/testInit';
import '@/models/Account';
import AccountType from '@/models/AccountType';

describe('Model: AccountType', () => {
  it('Shoud account type model has many associated accounts.', async () => {
    const accountType = await create('account_type');
    await create('account', { account_type_id: accountType.id });
    await create('account', { account_type_id: accountType.id });

    const accountTypeModel = await AccountType.where('id', accountType.id).fetch();
    const typeAccounts = await accountTypeModel.accounts().fetch();

    expect(typeAccounts.length).equals(2);
  });
});
