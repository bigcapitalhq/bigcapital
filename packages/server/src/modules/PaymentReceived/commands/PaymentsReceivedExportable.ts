import { Injectable } from '@nestjs/common';
import { PaymentReceivesApplication } from '../PaymentReceived.application';
import { IPaymentsReceivedFilter } from '../types/PaymentReceived.types';
import { EXPORT_SIZE_LIMIT } from '@/modules/Export/constants';
import { Exportable } from '@/modules/Export/Exportable';

@Injectable()
export class PaymentsReceivedExportable extends Exportable {
  constructor(private readonly paymentReceivedApp: PaymentReceivesApplication) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @param {IPaymentsReceivedFilter} query -
   * @returns
   */
  public exportable(query: IPaymentsReceivedFilter) {
    const filterQuery = (builder) => {
      builder.withGraphFetched('entries.invoice');
      builder.withGraphFetched('branch');
    };
    const parsedQuery = {
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
      filterQuery,
      ...query
    };
    return this.paymentReceivedApp
      .getPaymentsReceived(parsedQuery)
      .then((output) => output.paymentReceives);
  }
}
