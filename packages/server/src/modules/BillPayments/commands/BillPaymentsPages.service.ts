import { omit } from 'lodash';
import { ERRORS } from '../constants';
import { Inject, Injectable } from '@nestjs/common';
import { Bill } from '../../Bills/models/Bill';
import { BillPayment } from '../models/BillPayment';
import { IBillReceivePageEntry } from '../types/BillPayments.types';
import { ServiceError } from '../../Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class BillPaymentsPages {
  /**
   * @param {TenantModelProxy<typeof Bill>} billModel - Bill model.
   * @param {TenantModelProxy<typeof BillPayment>} billPaymentModel - Bill payment model.
   */
  constructor(
    @Inject(Bill.name)
    private readonly billModel: TenantModelProxy<typeof Bill>,

    @Inject(BillPayment.name)
    private readonly billPaymentModel: TenantModelProxy<typeof BillPayment>,
  ) { }

  /**
   * Retrieve bill payment with associated metadata.
   * @param {number} billPaymentId - The bill payment id.
   * @return {object}
   */
  public async getBillPaymentEditPage(billPaymentId: number): Promise<{
    billPayment: Omit<BillPayment, 'entries'>;
    entries: IBillReceivePageEntry[];
  }> {
    const billPayment = await this.billPaymentModel()
      .query()
      .findById(billPaymentId)
      .withGraphFetched('entries.bill')
      .withGraphFetched('attachments');

    // Throw not found the bill payment.
    if (!billPayment) {
      throw new ServiceError(ERRORS.PAYMENT_MADE_NOT_FOUND);
    }
    const paymentEntries = billPayment.entries.map((entry) => ({
      ...this.mapBillToPageEntry(entry.bill),
      dueAmount: entry.bill.dueAmount + entry.paymentAmount,
      paymentAmount: entry.paymentAmount,
    }));

    const resPayableBills = await this.billModel()
      .query()
      .modify('opened')
      .modify('dueBills')
      .where('vendor_id', billPayment.vendorId)
      .whereNotIn(
        'id',
        billPayment.entries.map((e) => e.billId),
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
    vendorId: number,
  ): Promise<IBillReceivePageEntry[]> {
    // Retrieve all payable bills that associated to the payment made transaction.
    const payableBills = await this.billModel()
      .query()
      .modify('opened')
      .modify('dueBills')
      .where('vendor_id', vendorId)
      .orderBy('bill_date', 'ASC');

    return payableBills.map(this.mapBillToPageEntry);
  }

  /**
   * Retrive edit page invoices entries from the given sale invoices models.
   * @param {Bill} bill - Bill.
   * @return {IBillReceivePageEntry}
   */
  private mapBillToPageEntry(bill: Bill): IBillReceivePageEntry {
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
