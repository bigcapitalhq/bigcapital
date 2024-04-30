import { Inject, Service } from 'typedi';
import { IBillsFilter } from '@/interfaces';
import { Exportable } from '@/services/Export/Exportable';
import { BillsApplication } from './BillsApplication';

@Service()
export class BillsExportable extends Exportable {
  @Inject()
  private billsApplication: BillsApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: IBillsFilter) {
    const parsedQuery = {
      ...query,
    } as IBillsFilter;

    return this.billsApplication
      .getBills(tenantId, parsedQuery)
      .then((output) => output.bills);
  }
}
