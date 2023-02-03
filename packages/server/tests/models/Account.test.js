import { 
  expect,
} from '~/testInit';
import Account from 'models/Account';
import AccountType from 'models/AccountType';
import {
  tenantFactory,
  tenantWebsite
} from '~/dbInit';
import DependencyGraph from '@/lib/DependencyGraph';

describe('Model: Account', () => {
  it('Should account model belongs to the associated account type model.', async () => {
    const accountType = await tenantFactory.create('account_type');
    const account = await tenantFactory.create('account', { account_type_id: accountType.id });

    const accountModel = await Account.tenant().query()
      .where('id', account.id)
      .withGraphFetched('type')
      .first();

    expect(accountModel.type.id).equals(accountType.id);
  });

  it('Should account model has one balance model that associated to the account model.', async () => {
    const accountBalance = await tenantFactory.create('account_balance');

    const accountModel = await Account.tenant().query()
      .where('id', accountBalance.accountId)
      .withGraphFetched('balance')
      .first();

    expect(accountModel.balance.amount).equals(accountBalance.amount);
  });

  it('Should account model has many transactions models that associated to the account model.', async () => {
    const account = await tenantFactory.create('account');
    const accountTransaction = await tenantFactory.create('account_transaction', { account_id: account.id });

    const accountModel = await Account.tenant().query().where('id', account.id).first();
    const transactionsModels = await accountModel.$relatedQuery('transactions');

    expect(transactionsModels.length).equals(1);
  });

  it('Should retrieve dependency graph.', async () => {
    const accountsDepGraph = await Account.tenant().depGraph().query();
    expect(accountsDepGraph).to.be.an.instanceOf(DependencyGraph);
  });
});
