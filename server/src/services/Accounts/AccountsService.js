import { Account, AccountType } from '@/models';

export default class AccountsService {
  static async isAccountExists(accountId) {
    const foundAccounts = await Account.tenant().query().where('id', accountId);
    return foundAccounts.length > 0;
  }

  static async getAccountByType(accountTypeKey) {
    const accountType = await AccountType.tenant()
      .query()
      .where('key', accountTypeKey)
      .first();

    const account = await Account.tenant()
      .query()
      .where('account_type_id', accountType.id)
      .first();

    return account;
  }
}
