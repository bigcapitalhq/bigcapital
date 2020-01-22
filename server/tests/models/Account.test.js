import { create, expect } from '~/testInit';
import Account from '@/models/Account';
import AccountType from '@/models/AccountType';

describe('Model: Account', () => {
  it('Should account model belongs to the associated account type model.', async () => {
    const accountType = await create('account_type');
    const account = await create('account', { account_type_id: accountType.id });

    const accountModel = await Account.query()
      .where('id', account.id)
      .withGraphFetched('type')
      .first();

    expect(accountModel.type.id).equals(accountType.id);
  });

  it('Should account model has one balance model that associated to the account model.', async () => {
    const accountBalance = await create('account_balance');

    const accountModel = await Account.query()
      .where('id', accountBalance.accountId)
      .withGraphFetched('balance')
      .first();

    expect(accountModel.balance.amount).equals(accountBalance.amount);
  });

  it('Should account model has many transactions models that associated to the account model.', async () => {
    const account = await create('account');
    const accountTransaction = await create('account_transaction', { account_id: account.id });

    const accountModel = await Account.query().where('id', account.id).first();
    const transactionsModels = await accountModel.$relatedQuery('transactions');

    expect(transactionsModels.length).equals(1);
  });
});
