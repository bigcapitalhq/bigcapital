import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import PromisePool, { ProcessHandler } from '@supercharge/promise-pool';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  IBillPayment,
  IBillPrepardExpensesAppliedEventPayload,
  IPaymentPrepardExpensesAppliedEventPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class AutoApplyPrepardExpenses {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

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
    const { BillPayment, Bill } = this.tenancy.models(tenantId);

    const bill = await Bill.query(trx).findById(billId).throwIfNotFound();

    const unappliedPayments = await BillPayment.query(trx)
      .where('vendorId', bill.vendorId)
      .whereRaw('amount - applied_amount > 0')
      .whereNotNull('prepardExpensesAccountId');

    let unappliedAmount = bill.total;
    let appliedTotalAmount = 0; // Total applied amount after applying.

    const precessHandler: ProcessHandler<IBillPayment, void> = async (
      unappliedPayment: IBillPayment,
      index: number,
      pool
    ) => {
      const appliedAmount = Math.min(unappliedAmount, unappliedPayment.amount);
      unappliedAmount = unappliedAmount - appliedAmount;
      appliedTotalAmount += appliedAmount;

      // Stop applying once the unapplied amount reach zero or less.
      if (appliedAmount <= 0) {
        pool.stop();
        return;
      }
      await this.applyBillToPaymentMade(
        tenantId,
        unappliedPayment.id,
        bill.id,
        appliedAmount,
        trx
      );
    };
    await PromisePool.withConcurrency(1)
      .for(unappliedPayments)
      .process(precessHandler);

    // Increase the paid amount of the purchase invoice.
    await Bill.changePaymentAmount(billId, appliedTotalAmount, trx);

    // Triggers `onBillPrepardExpensesApplied` event.
    await this.eventPublisher.emitAsync(events.bill.onPrepardExpensesApplied, {
      tenantId,
      billId,
      trx,
    } as IBillPrepardExpensesAppliedEventPayload);
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
    await BillPayment.query(trx).increment('appliedAmount', appliedAmount);

    // Triggers `onBillPaymentPrepardExpensesApplied` event.
    await this.eventPublisher.emitAsync(
      events.billPayment.onPrepardExpensesApplied,
      {
        tenantId,
        billPaymentId,
        billId,
        appliedAmount,
        trx,
      } as IPaymentPrepardExpensesAppliedEventPayload
    );
  };
}
