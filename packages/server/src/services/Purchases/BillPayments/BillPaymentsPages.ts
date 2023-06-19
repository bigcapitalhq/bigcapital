import { Inject, Service } from 'typedi';
import { omit } from 'lodash';
import TenancyService from '@/services/Tenancy/TenancyService';
import { IBill, IBillPayment, IBillReceivePageEntry } from '@/interfaces';
import { ERRORS } from './constants';
import { ServiceError } from '@/exceptions';

/**
 * Bill payments edit and create pages services.
 */
@Service()
export default class BillPaymentsPages {
  @Inject()
  tenancy: TenancyService;

  /**
   * Retrieve bill payment with associated metadata.
   * @param {number} billPaymentId - The bill payment id.
   * @return {object}
   */
  public async getBillPaymentEditPage(
    tenantId: number,
    billPaymentId: number
  ): Promise<{
    billPayment: Omit<IBillPayment, 'entries'>;
    entries: IBillReceivePageEntry[];
  }> {
    const { BillPayment, Bill } = this.tenancy.models(tenantId);
    const billPayment = await BillPayment.query()
      .findById(billPaymentId)
      .withGraphFetched('entries.bill');

    // Throw not found the bill payment.
    if (!billPayment) {
      throw new ServiceError(ERRORS.PAYMENT_MADE_NOT_FOUND);
    }
    const paymentEntries = billPayment.entries.map((entry) => ({
      ...this.mapBillToPageEntry(entry.bill),
      dueAmount: entry.bill.dueAmount + entry.paymentAmount,
      paymentAmount: entry.paymentAmount,
    }));

    const resPayableBills = await Bill.query()
      .modify('opened')
      .modify('dueBills')
      .where('vendor_id', billPayment.vendorId)
      .whereNotIn(
        'id',
        billPayment.entries.map((e) => e.billId)
      )
      .orderBy('bill_date', 'ASC');

    // Mapping the payable bills to entries.
    const restPayableEntries = resPayableBills.map(this.mapBillToPageEntry);
    const entries = [...paymentEntries, ...restPayableEntries];

    return {
      billPayment: omit(billPayment, ['entries']),
      entries,
    };
  }

  /**
   * Retrieve the payable entries of the new page once vendor be selected.
   * @param {number} tenantId
   * @param {number} vendorId
   */
  public async getNewPageEntries(
    tenantId: number,
    vendorId: number
  ): Promise<IBillReceivePageEntry[]> {
    const { Bill } = this.tenancy.models(tenantId);

    // Retrieve all payable bills that associated to the payment made transaction.
    const payableBills = await Bill.query()
      .modify('opened')
      .modify('dueBills')
      .where('vendor_id', vendorId)
      .orderBy('bill_date', 'ASC');

    return payableBills.map(this.mapBillToPageEntry);
  }

  /**
   * Retrieve edit page invoices entries from the given sale invoices models.
   * @param  {ISaleInvoice[]} invoices - Invoices.
   * @return {IPaymentReceiveEditPageEntry}
   */
  private mapBillToPageEntry(bill: IBill): IBillReceivePageEntry {
    return {
      entryType: 'invoice',
      billId: bill.id,
      billNo: bill.billNumber,
      amount: bill.amount,
      dueAmount: bill.dueAmount,
      totalPaymentAmount: bill.paymentAmount,
      paymentAmount: bill.paymentAmount,
      currencyCode: bill.currencyCode,
      date: bill.billDate,
    };
  }
}
