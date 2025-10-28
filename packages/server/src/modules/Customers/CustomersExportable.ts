import { Injectable } from '@nestjs/common';
import { CustomersApplication } from './CustomersApplication.service';
import { IItemsFilter } from '../Items/types/Items.types';
import { EXPORT_SIZE_LIMIT } from '../Export/constants';
import { Exportable } from '../Export/Exportable';
import { ICustomersFilter } from './types/Customers.types';
import { ExportableService } from '../Export/decorators/ExportableModel.decorator';
import { Customer } from './models/Customer';

@Injectable()
@ExportableService({ name: Customer.name })
export class CustomersExportable extends Exportable {
  constructor(private readonly customersApplication: CustomersApplication) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {ICustomersFilter} query - Customers query.
   */
  public exportable(query: ICustomersFilter) {
    const parsedQuery = {
      sortOrder: 'DESC',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
    } as IItemsFilter;

    return this.customersApplication
      .getCustomers(parsedQuery)
      .then((output) => output.customers);
  }
}
