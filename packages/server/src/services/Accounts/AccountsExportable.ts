import { Inject, Service } from 'typedi';
import { AccountsApplication } from './AccountsApplication';
import { Exportable } from '../Export/Exportable';
import { IAccountsFilter, IAccountsStructureType } from '@/interfaces';
import { EXPORT_SIZE_LIMIT } from '../Export/constants';

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
      pageSize: EXPORT_SIZE_LIMIT,
      page: 1,
    } as IAccountsFilter;

    return this.accountsApplication
      .getAccounts(tenantId, parsedQuery)
      .then((output) => output.accounts);
  }
}
