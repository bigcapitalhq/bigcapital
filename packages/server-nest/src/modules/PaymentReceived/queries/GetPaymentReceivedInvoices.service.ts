import { Inject, Injectable } from '@nestjs/common';
import { PaymentReceivedValidators } from '../commands/PaymentReceivedValidators.service';
import { SaleInvoice } from '../../SaleInvoices/models/SaleInvoice';
import { PaymentReceived } from '../models/PaymentReceived';

@Injectable()
export class GetPaymentReceivedInvoices {
  constructor(
    @Inject(PaymentReceived.name)
    private paymentReceiveModel: typeof PaymentReceived,

    @Inject(SaleInvoice.name)
    private saleInvoiceModel: typeof SaleInvoice,

    private validators: PaymentReceivedValidators,
  ) {}

  /**
   * Retrieve sale invoices that associated to the given payment receive.
   * @param {number} paymentReceiveId - Payment receive id.
   * @return {Promise<ISaleInvoice>}
   */
  public async getPaymentReceiveInvoices(paymentReceiveId: number) {
    const paymentReceive = await this.paymentReceiveModel
      .query()
      .findById(paymentReceiveId)
      .withGraphFetched('entries');

    // Validates the payment receive existence.
    this.validators.validatePaymentExistance(paymentReceive);

    const paymentReceiveInvoicesIds = paymentReceive.entries.map(
      (entry) => entry.invoiceId,
    );
    const saleInvoices = await this.saleInvoiceModel
      .query()
      .whereIn('id', paymentReceiveInvoicesIds);

    return saleInvoices;
  }
}
