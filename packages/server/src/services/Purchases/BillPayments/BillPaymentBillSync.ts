import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IBillPaymentEntryDTO } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { entriesAmountDiff } from '@/utils';

@Service()
export class BillPaymentBillSync {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Saves bills payment amount changes different.
   * @param {number} tenantId -
   * @param {IBillPaymentEntryDTO[]} paymentMadeEntries -
   * @param {IBillPaymentEntryDTO[]} oldPaymentMadeEntries -
   */
  public async saveChangeBillsPaymentAmount(
    tenantId: number,
    paymentMadeEntries: IBillPaymentEntryDTO[],
    oldPaymentMadeEntries?: IBillPaymentEntryDTO[],
    trx?: Knex.Transaction
  ): Promise<void> {
    const { Bill } = this.tenancy.models(tenantId);
    const opers: Promise<void>[] = [];

    const diffEntries = entriesAmountDiff(
      paymentMadeEntries,
      oldPaymentMadeEntries,
      'paymentAmount',
      'billId'
    );
    diffEntries.forEach(
      (diffEntry: { paymentAmount: number; billId: number }) => {
        if (diffEntry.paymentAmount === 0) {
          return;
        }
        const oper = Bill.changePaymentAmount(
          diffEntry.billId,
          diffEntry.paymentAmount,
          trx
        );
        opers.push(oper);
      }
    );
    await Promise.all(opers);
  }
}
