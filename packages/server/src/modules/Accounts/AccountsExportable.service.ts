import { AccountsApplication } from './AccountsApplication.service';
import { Exportable } from '../Export/Exportable';
import { EXPORT_SIZE_LIMIT } from '../Export/constants';
import { IAccountsFilter, IAccountsStructureType } from './Accounts.types';
import { Injectable } from '@nestjs/common';
import { ExportableService } from '../Export/decorators/ExportableModel.decorator';
import { Account } from './models/Account.model';

@Injectable()
@ExportableService({ name: Account.name })
export class AccountsExportable extends Exportable {
  /**
   * @param {AccountsApplication} accountsApplication  
   */
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
