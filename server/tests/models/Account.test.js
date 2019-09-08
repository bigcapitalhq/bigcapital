import { create, expect } from '~/testInit';
import Account from '@/models/Account';
// eslint-disable-next-line no-unused-vars
import AccountType from '@/models/AccountType';

describe('Model: Account', () => {
  it('Should account model belongs to the associated account type model.', async () => {
    const accountType = await create('account_type');
    const account = await create('account', { account_type_id: accountType.id });

    const accountModel = await Account.where('id', account.id).fetch();
    const accountTypeModel = await accountModel.type().fetch();

    expect(accountTypeModel.attributes.id).equals(account.id);
  });
});
