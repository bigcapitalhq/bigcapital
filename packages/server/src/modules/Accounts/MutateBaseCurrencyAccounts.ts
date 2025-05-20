import { Inject, Injectable } from '@nestjs/common';
import { Account } from './models/Account.model';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class MutateBaseCurrencyAccounts {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) {}

  /**
   * Mutates the all accounts or the organziation.
   * @param {string} currencyCode
   */
  async mutateAllAccountsCurrency(currencyCode: string) {
    await this.accountModel().query().update({ currencyCode });
  }
}
