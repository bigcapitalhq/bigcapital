import { Inject, Service } from 'typedi';
import { IAccountsStructureType, IPaymentsReceivedFilter } from '@/interfaces';
import { Exportable } from '@/services/Export/Exportable';
import { PaymentReceivesApplication } from './PaymentReceivedApplication';

@Service()
export class PaymentsReceivedExportable extends Exportable {
  @Inject()
  private paymentReceivedApp: PaymentReceivesApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @param {IPaymentsReceivedFilter} query -
   * @returns
   */
  public exportable(tenantId: number, query: IPaymentsReceivedFilter) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      inactiveMode: false,
      ...query,
      structure: IAccountsStructureType.Flat,
    } as IPaymentsReceivedFilter;

    return this.paymentReceivedApp
      .getPaymentReceives(tenantId, parsedQuery)
      .then((output) => output.paymentReceives);
  }
}
