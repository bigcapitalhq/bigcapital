import { Inject, Service } from 'typedi';
import { omit } from 'lodash';
import {
  ISaleInvoice,
  IPaymentReceivePageEntry,
  IPaymentReceive,
  ISystemUser,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';

/**
 * Payment receives edit/new pages service.
 */
@Service()
export default class PaymentReceivesPages {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  /**
   * Retrieve page invoices entries from the given sale invoices models.
   * @param  {ISaleInvoice[]} invoices - Invoices.
   * @return {IPaymentReceivePageEntry}
   */
  private invoiceToPageEntry(invoice: ISaleInvoice): IPaymentReceivePageEntry {
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
   * @param {number} tenantId - Tenant id.
   * @param {number} vendorId - Vendor id.
   * @return {IPaymentReceivePageEntry[]}
   */
  public async getNewPageEntries(tenantId: number, customerId: number) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Retrieve due invoices.
    const entries = await SaleInvoice.query()
      .modify('delivered')
      .modify('dueInvoices')
      .where('customer_id', customerId)
      .orderBy('invoice_date', 'ASC');

    return entries.map(this.invoiceToPageEntry);
  }

  /**
   * Retrieve the payment receive details of the given id.
   * @param {number} tenantId - Tenant id.
   * @param {Integer} paymentReceiveId - Payment receive id.
   */
  public async getPaymentReceiveEditPage(
    tenantId: number,
    paymentReceiveId: number,
  ): Promise<{
    paymentReceive: Omit<IPaymentReceive, 'entries'>;
    entries: IPaymentReceivePageEntry[];
  }> {
    const { PaymentReceive, SaleInvoice } = this.tenancy.models(tenantId);

    // Retrieve payment receive.
    const paymentReceive = await PaymentReceive.query()
      .findById(paymentReceiveId)
      .withGraphFetched('entries.invoice');

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
    const restReceivableInvoices = await SaleInvoice.query()
      .modify('delivered')
      .modify('dueInvoices')
      .where('customer_id', paymentReceive.customerId)
      .whereNotIn(
        'id',
        paymentReceive.entries.map((entry) => entry.invoiceId)
      )
      .orderBy('invoice_date', 'ASC');

    const restReceivableEntries = restReceivableInvoices.map(
      this.invoiceToPageEntry
    );
    const entries = [...paymentEntries, ...restReceivableEntries];

    return {
      paymentReceive: omit(paymentReceive, ['entries']),
      entries,
    };
  }
}
