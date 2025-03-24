import { AccountsApplication } from './AccountsApplication.service';
import { Exportable } from '../Export/Exportable';
import { EXPORT_SIZE_LIMIT } from '../Export/constants';
import { IAccountsFilter, IAccountsStructureType } from './Accounts.types';

export class AccountsExportable extends Exportable {
  constructor(private readonly accountsApplication: AccountsApplication) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   */
  public exportable(query: IAccountsFilter) {
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
      .getAccounts(parsedQuery)
      .then((output) => output.accounts);
  }
}
