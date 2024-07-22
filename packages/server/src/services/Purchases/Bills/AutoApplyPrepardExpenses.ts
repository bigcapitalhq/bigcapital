import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import PromisePool from '@supercharge/promise-pool';
import { Inject, Service } from 'typedi';

@Service()
export class AutoApplyPrepardExpenses {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Auto apply prepard expenses to the given bill.
   * @param {number} tenantId
   * @param {number} billId
   * @returns {Promise<void>}
   */
  async autoApplyPrepardExpensesToBill(
    tenantId: number,
    billId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { PaymentMade, Bill } = this.tenancy.models(tenantId);

    const unappliedPayments = await PaymentMade.query(trx).where(
      'unappliedAmount',
      '>',
      0
    );
    const bill = Bill.query(trx).findById(billId).throwIfNotFound();

    await PromisePool.withConcurrency(1)
      .for(unappliedPayments)
      .process(async (unappliedPayment: any) => {
        const appliedAmount = 1;

        await this.applyBillToPaymentMade(
          tenantId,
          unappliedPayment.id,
          bill.id,
          appliedAmount,
          trx
        );
      });

    // Increase the paid amount of the purchase invoice.
    await Bill.changePaymentAmount(billId, 0, trx);
  }

  /**
   * Apply the given bill to payment made transaction.
   * @param {number} tenantId
   * @param {number} billPaymentId
   * @param {number} billId
   * @param {number} appliedAmount
   * @param {Knex.Transaction} trx
   */
  public applyBillToPaymentMade = async (
    tenantId: number,
    billPaymentId: number,
    billId: number,
    appliedAmount: number,
    trx?: Knex.Transaction
  ) => {
    const { BillPaymentEntry, BillPayment } = this.tenancy.models(tenantId);

    await BillPaymentEntry.query(trx).insert({
      billPaymentId,
      billId,
      paymentAmount: appliedAmount,
    });
    await BillPayment.query().increment('usedAmount', appliedAmount);
  };
}
