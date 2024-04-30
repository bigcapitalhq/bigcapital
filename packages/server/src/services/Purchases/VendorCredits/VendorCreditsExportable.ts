import { Inject, Service } from 'typedi';
import { IVendorCreditsQueryDTO } from '@/interfaces';
import ListVendorCredits from './ListVendorCredits';
import { Exportable } from '@/services/Export/Exportable';

@Service()
export class VendorCreditsExportable extends Exportable {
  @Inject()
  private getVendorCredits: ListVendorCredits;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId -
   * @param {IVendorCreditsQueryDTO} query -
   * @returns {}
   */
  public exportable(tenantId: number, query: IVendorCreditsQueryDTO) {
    const parsedQuery = {
      ...query,
    } as IVendorCreditsQueryDTO;

    return this.getVendorCredits
      .getVendorCredits(tenantId, parsedQuery)
      .then((output) => output.vendorCredits);
  }
}
