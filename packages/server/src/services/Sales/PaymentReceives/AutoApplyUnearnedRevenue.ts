import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import PromisePool, { ProcessHandler } from '@supercharge/promise-pool';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import {
  IPaymentReceive,
  PaymentReceiveUnearnedRevenueAppliedEventPayload,
  SaleInvoiceAppliedUnearnedRevenueOnCreatedEventPayload,
} from '@/interfaces';

@Service()
export class AutoApplyUnearnedRevenue {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Auto apply invoice to advanced payment received transactions.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns {Promise<void>}
   */
  public async autoApplyUnearnedRevenueToInvoice(
    tenantId: number,
    saleInvoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { PaymentReceive, SaleInvoice } = this.tenancy.models(tenantId);

    const unappliedPayments = await PaymentReceive.query(trx).where(
      'unappliedAmount',
      '>',
      0
    );
    const invoice = await SaleInvoice.query(trx)
      .findById(saleInvoiceId)
      .throwIfNotFound();

    let unappliedAmount = invoice.total;
    let appliedTotalAmount = 0;

    const processHandler: ProcessHandler<
      IPaymentReceive,
      Promise<void>
    > = async (unappliedPayment: IPaymentReceive, index: number, pool) => {
      const appliedAmount = Math.min(unappliedAmount, unappliedAmount);
      unappliedAmount = unappliedAmount - appliedAmount;
      appliedTotalAmount += appliedAmount;

      if (appliedAmount <= 0) {
        pool.stop();
        return;
      }
      await this.applyInvoiceToPaymentReceived(
        tenantId,
        unappliedPayment.id,
        invoice.id,
        appliedAmount,
        trx
      );
    };
    await PromisePool.withConcurrency(1)
      .for(unappliedPayments)
      .process(processHandler);

    // Increase the paid amount of the sale invoice.
    await SaleInvoice.changePaymentAmount(
      saleInvoiceId,
      appliedTotalAmount,
      trx
    );
    // Triggers event `onSaleInvoiceUnearnedRevenue`.
    await this.eventPublisher.emitAsync(
      events.saleInvoice.onUnearnedRevenueApplied,
      {
        tenantId,
        saleInvoiceId,
        trx,
      } as SaleInvoiceAppliedUnearnedRevenueOnCreatedEventPayload
    );
  }

  /**
   * Apply the given invoice to payment received transaction.
   * @param {number} tenantId
   * @param {number} paymentReceivedId
   * @param {number} invoiceId
   * @param {number} appliedAmount
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public applyInvoiceToPaymentReceived = async (
    tenantId: number,
    paymentReceiveId: number,
    invoiceId: number,
    appliedAmount: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { PaymentReceiveEntry, PaymentReceive } =
      this.tenancy.models(tenantId);

    await PaymentReceiveEntry.query(trx).insert({
      paymentReceiveId,
      invoiceId,
      paymentAmount: appliedAmount,
    });
    await PaymentReceive.query(trx).increment('usedAmount', appliedAmount);

    // Triggers the event `onPaymentReceivedUnearnedRevenue`.
    await this.eventPublisher.emitAsync(
      events.paymentReceive.onUnearnedRevenueApplied,
      {
        tenantId,
        paymentReceiveId,
        saleInvoiceId: invoiceId,
        appliedAmount,
        trx,
      } as PaymentReceiveUnearnedRevenueAppliedEventPayload
    );
  };
}
