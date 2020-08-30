import { Inject, Service } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';

@Service()
export default class AccountsService {
  @Inject()
  tenancy: TenancyService;

  async isAccountExists(tenantId: number, accountId: number) {
    const { Account } = this.tenancy.models(tenantId);
    const foundAccounts = await Account.query()
      .where('id', accountId);

    return foundAccounts.length > 0;
  }

  async getAccountByType(tenantId: number, accountTypeKey: string) {
    const { AccountType, Account } = this.tenancy.models(tenantId);
    const accountType = await AccountType.query()
      .where('key', accountTypeKey)
      .first();

    const account = await Account.query()
      .where('account_type_id', accountType.id)
      .first();

    return account;
  }
}
