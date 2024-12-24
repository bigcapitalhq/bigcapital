import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Bill } from '../../Bills/models/Bill';
import { IBillPaymentEntryDTO } from '../types/BillPayments.types';

@Injectable()
export class BillPaymentBillSync {
  constructor(private readonly bill: typeof Bill) {}

  /**
   * Saves bills payment amount changes different.
   * @param {number} tenantId -
   * @param {IBillPaymentEntryDTO[]} paymentMadeEntries -
   * @param {IBillPaymentEntryDTO[]} oldPaymentMadeEntries -
   */
  public async saveChangeBillsPaymentAmount(
    paymentMadeEntries: IBillPaymentEntryDTO[],
    oldPaymentMadeEntries?: IBillPaymentEntryDTO[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    const opers: Promise<void>[] = [];

    const diffEntries = entriesAmountDiff(
      paymentMadeEntries,
      oldPaymentMadeEntries,
      'paymentAmount',
      'billId',
    );
    diffEntries.forEach(
      (diffEntry: { paymentAmount: number; billId: number }) => {
        if (diffEntry.paymentAmount === 0) {
          return;
        }
        const oper = this.bill.changePaymentAmount(
          diffEntry.billId,
          diffEntry.paymentAmount,
          trx,
        );
        opers.push(oper);
      },
    );
    await Promise.all(opers);
  }
}
