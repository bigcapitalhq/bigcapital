import { Injectable } from '@nestjs/common';
import { VendorsApplication } from './VendorsApplication.service';
import { Exportable } from '../Export/Exportable';
import { IVendorsFilter } from './types/Vendors.types';
import { EXPORT_SIZE_LIMIT } from '../Export/constants';
import { ExportableService } from '../Export/decorators/ExportableModel.decorator';
import { Vendor } from './models/Vendor';

@Injectable()
@ExportableService({ name: Vendor.name })
export class VendorsExportable extends Exportable {
  constructor(
    private readonly vendorsApplication: VendorsApplication,
  ) {
    super();
  }

  /**
   * Retrieves the vendors data to exportable sheet.
   */
  public exportable(query: IVendorsFilter) {
    const parsedQuery = {
      sortOrder: 'DESC',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
    } as IVendorsFilter;

    return this.vendorsApplication
      .getVendors(parsedQuery)
      .then((output) => output.vendors);
  }
}
