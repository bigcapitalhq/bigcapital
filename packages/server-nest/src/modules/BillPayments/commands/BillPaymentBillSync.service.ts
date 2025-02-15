import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Bill } from '../../Bills/models/Bill';
import { IBillPaymentEntryDTO } from '../types/BillPayments.types';
import { entriesAmountDiff } from '@/utils/entries-amount-diff';
import Objection from 'objection';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class BillPaymentBillSync {
  constructor(
    @Inject(Bill.name)
    private readonly bill: TenantModelProxy<typeof Bill>,
  ) {}

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
    const opers: Objection.QueryBuilder<Bill, Bill[]>[] = [];

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
        const oper = this.bill().changePaymentAmount(
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
