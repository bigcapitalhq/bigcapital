import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import PromisePool from '@supercharge/promise-pool';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class AutoApplyUnearnedRevenue {
  @Inject()
  private tenancy: HasTenancyService;
  /**
   * Auto apply invoice to advanced payment received transactions.
   * @param {number} tenantId
   * @param {number} invoiceId
   */
  public async autoApplyUnearnedRevenueToInvoice(
    tenantId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ) {
    const { PaymentReceive, SaleInvoice } = this.tenancy.models(tenantId);

    const unappliedPayments = await PaymentReceive.query(trx).where(
      'unappliedAmount',
      '>',
      0
    );
    const invoice = await SaleInvoice.query(trx)
      .findById(invoiceId)
      .throwIfNotFound();

    let unappliedAmount = invoice.balance;

    await PromisePool.withConcurrency(1)
      .for(unappliedPayments)
      .process(async (unappliedPayment: any) => {
        const appliedAmount = unappliedAmount;

        await this.applyInvoiceToPaymentReceived(
          tenantId,
          unappliedPayment.id,
          invoice.id,
          appliedAmount,
          trx
        );
      });
    // Increase the paid amount of the sale invoice.
    await SaleInvoice.changePaymentAmount(invoiceId, unappliedAmount, trx);
  }

  /**
   * Apply the given invoice to payment received transaction.
   * @param {number} tenantId
   * @param {number} paymentReceivedId
   * @param {number} invoiceId
   * @param {number} appliedAmount
   * @param {Knex.Transaction} trx
   */
  public applyInvoiceToPaymentReceived = async (
    tenantId: number,
    paymentReceiveId: number,
    invoiceId: number,
    appliedAmount: number,
    trx?: Knex.Transaction
  ) => {
    const { PaymentReceiveEntry, PaymentReceive } =
      this.tenancy.models(tenantId);

    await PaymentReceiveEntry.query(trx).insert({
      paymentReceiveId,
      invoiceId,
      paymentAmount: appliedAmount,
    });
    await PaymentReceive.query(trx).increment('usedAmount', appliedAmount);
  };
}
