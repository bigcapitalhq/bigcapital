import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Bill } from '../../Bills/models/Bill';
import { entriesAmountDiff } from '@/utils/entries-amount-diff';
import Objection, { ModelObject } from 'objection';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BillPaymentEntryDto } from '../dtos/BillPayment.dto';
import { BillPaymentEntry } from '../models/BillPaymentEntry';

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
    paymentMadeEntries: BillPaymentEntryDto[],
    oldPaymentMadeEntries?: ModelObject<BillPaymentEntry>[],
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
