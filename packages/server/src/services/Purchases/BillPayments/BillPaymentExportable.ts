import { Inject, Service } from 'typedi';
import { Exportable } from '@/services/Export/Exportable';
import { BillPaymentsApplication } from './BillPaymentsApplication';

@Service()
export class BillPaymentExportable extends Exportable {
  @Inject()
  private billPaymentsApplication: BillPaymentsApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number, query: any) {
    const parsedQuery = {
      page: 1,
      pageSize: 12,
      ...query,
      sortOrder: 'desc',
      columnSortBy: 'created_at',
    } as any;

    return this.billPaymentsApplication
      .getBillPayments(tenantId, parsedQuery)
      .then((output) => output.billPayments);
  }
}
