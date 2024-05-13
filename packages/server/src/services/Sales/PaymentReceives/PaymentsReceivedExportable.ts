import { Inject, Service } from 'typedi';
import { IAccountsStructureType, IPaymentReceivesFilter } from '@/interfaces';
import { Exportable } from '@/services/Export/Exportable';
import { PaymentReceivesApplication } from './PaymentReceivesApplication';

@Service()
export class PaymentsReceivedExportable extends Exportable {
  @Inject()
  private paymentReceivedApp: PaymentReceivesApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @param {IPaymentReceivesFilter} query -
   * @returns
   */
  public exportable(tenantId: number, query: IPaymentReceivesFilter) {
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      inactiveMode: false,
      ...query,
      structure: IAccountsStructureType.Flat,
    } as IPaymentReceivesFilter;

    return this.paymentReceivedApp
      .getPaymentReceives(tenantId, parsedQuery)
      .then((output) => output.paymentReceives);
  }
}
