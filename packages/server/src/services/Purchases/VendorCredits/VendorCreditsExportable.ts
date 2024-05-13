import { Inject, Service } from 'typedi';
import { IVendorCreditsQueryDTO } from '@/interfaces';
import ListVendorCredits from './ListVendorCredits';
import { Exportable } from '@/services/Export/Exportable';

@Service()
export class VendorCreditsExportable extends Exportable {
  @Inject()
  private getVendorCredits: ListVendorCredits;

  /**
   * Retrieves the vendor credits data to exportable sheet.
   * @param {number} tenantId -
   * @param {IVendorCreditsQueryDTO} query -
   * @returns {}
   */
  public exportable(tenantId: number, query: IVendorCreditsQueryDTO) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: 12000,
    } as IVendorCreditsQueryDTO;

    return this.getVendorCredits
      .getVendorCredits(tenantId, parsedQuery)
      .then((output) => output.vendorCredits);
  }
}
