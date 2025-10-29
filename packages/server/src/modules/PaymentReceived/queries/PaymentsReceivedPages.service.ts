import { Inject, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { IPaymentReceivePageEntry } from '../types/PaymentReceived.types';
import { ERRORS } from '../constants';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { PaymentReceived } from '../models/PaymentReceived';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

/**
 * Payment receives edit/new pages service.
 */
@Injectable()
export class PaymentsReceivedPagesService {
  constructor(
    @Inject(SaleInvoice.name)
    private readonly saleInvoice: TenantModelProxy<typeof SaleInvoice>,

    @Inject(PaymentReceived.name)
    private readonly paymentReceived: TenantModelProxy<typeof PaymentReceived>,
  ) { }

  /**
   * Retrive page invoices entries from the given sale invoices models.
   * @param  {ISaleInvoice[]} invoices - Invoices.
   * @return {IPaymentReceivePageEntry}
   */
  private invoiceToPageEntry(invoice: SaleInvoice): IPaymentReceivePageEntry {
    return {
      entryType: 'invoice',
      invoiceId: invoice.id,
      invoiceNo: invoice.invoiceNo,
      amount: invoice.balance,
      dueAmount: invoice.dueAmount,
      paymentAmount: invoice.paymentAmount,
      totalPaymentAmount: invoice.paymentAmount,
      currencyCode: invoice.currencyCode,
      date: invoice.invoiceDate,
    };
  }

  /**
   * Retrieve payment receive new page receivable entries.
   * @param {number} vendorId - Vendor id.
   * @return {IPaymentReceivePageEntry[]}
   */
  public async getNewPageEntries(customerId: number) {
    // Retrieve due invoices.
    const entries = await this.saleInvoice()
      .query()
      .modify('delivered')
      .modify('dueInvoices')
      .where('customer_id', customerId)
      .orderBy('invoice_date', 'ASC');

    return entries.map(this.invoiceToPageEntry);
  }

  /**
   * Retrieve the payment receive details of the given id.
   * @param {number} paymentReceiveId - Payment receive id.
   */
  public async getPaymentReceiveEditPage(paymentReceiveId: number): Promise<{
    data: Omit<PaymentReceived, 'entries'>;
    entries: IPaymentReceivePageEntry[];
  }> {
    // Retrieve payment receive.
    const paymentReceive = await this.paymentReceived()
      .query()
      .findById(paymentReceiveId)
      .withGraphFetched('entries.invoice')
      .withGraphFetched('attachments');

    // Throw not found the payment receive.
    if (!paymentReceive) {
      throw new ServiceError(ERRORS.PAYMENT_RECEIVE_NOT_EXISTS);
    }
    const paymentEntries = paymentReceive.entries.map((entry) => ({
      ...this.invoiceToPageEntry(entry.invoice),
      dueAmount: entry.invoice.dueAmount + entry.paymentAmount,
      paymentAmount: entry.paymentAmount,
      index: entry.index,
    }));
    // Retrieves all receivable bills that associated to the payment receive transaction.
    const restReceivableInvoices = await this.saleInvoice()
      .query()
      .modify('delivered')
      .modify('dueInvoices')
      .where('customer_id', paymentReceive.customerId)
      .whereNotIn(
        'id',
        paymentReceive.entries.map((entry) => entry.invoiceId),
      )
      .orderBy('invoice_date', 'ASC');

    const restReceivableEntries = restReceivableInvoices.map(
      this.invoiceToPageEntry,
    );
    const entries = [...paymentEntries, ...restReceivableEntries];

    return {
      data: omit(paymentReceive, ['entries']),
      entries,
    };
  }
}
