import { Inject, Service } from 'typedi';
import { AccountsApplication } from './AccountsApplication';
import { Exportable } from '../Export/Exportable';
import { IAccountsFilter, IAccountsStructureType } from '@/interfaces';

@Service()
export class AccountsExportable extends Exportable {
  @Inject()
  private accountsApplication: AccountsApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: IAccountsFilter) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      inactiveMode: false,
      ...query,
      structure: IAccountsStructureType.Flat,
      pageSize: 12000,
      page: 1,
    } as IAccountsFilter;

    return this.accountsApplication
      .getAccounts(tenantId, parsedQuery)
      .then((output) => output.accounts);
  }
}
