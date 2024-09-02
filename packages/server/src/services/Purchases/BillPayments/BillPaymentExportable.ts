import { Inject, Service } from 'typedi';
import { Exportable } from '@/services/Export/Exportable';
import { BillPaymentsApplication } from './BillPaymentsApplication';
import { EXPORT_SIZE_LIMIT } from '@/services/Export/constants';

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
    const filterQuery = (builder) => {
      builder.withGraphFetched('entries.bill');
      builder.withGraphFetched('branch');
    };
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
      filterQuery
    } as any;

    return this.billPaymentsApplication
      .getBillPayments(tenantId, parsedQuery)
      .then((output) => output.billPayments);
  }
}
