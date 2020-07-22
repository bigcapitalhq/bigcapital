import { Account } from '@/models';

export default class AccountsService {

  static async isAccountExists(accountId) {
    const foundAccounts = await Account.tenant().query().where('id', accountId);
    return foundAccounts.length > 0;
  }
}