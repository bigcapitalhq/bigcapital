import { Knex } from 'knex';
import async from 'async';
import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { PaymentReceivedGLEntries } from '../PaymentReceived/PaymentReceivedGLEntries';

@Service()
export class InvoicePaymentsGLEntriesRewrite {
  @Inject()
  public tenancy: HasTenancyService;

  @Inject()
  public paymentGLEntries: PaymentReceivedGLEntries;

  /**
   * Rewrites the payment GL entries task.
   * @param   {{ tenantId: number, paymentId: number, trx: Knex?.Transaction }}
   * @returns {Promise<void>}
   */
  public rewritePaymentsGLEntriesTask = async ({
    tenantId,
    paymentId,
    trx,
  }) => {
    await this.paymentGLEntries.rewritePaymentGLEntries(
      tenantId,
      paymentId,
      trx
    );
  };

  /**
   * Rewrites the payment GL entries of the given payments ids.
   * @param {number} tenantId
   * @param {number[]} paymentsIds
   * @param {Knex.Transaction} trx
   */
  public rewritePaymentsGLEntriesQueue = async (
    tenantId: number,
    paymentsIds: number[],
    trx?: Knex.Transaction
  ) => {
    // Initiate a new queue for accounts balance mutation.
    const rewritePaymentGL = async.queue(this.rewritePaymentsGLEntriesTask, 10);

    paymentsIds.forEach((paymentId: number) => {
      rewritePaymentGL.push({ paymentId, trx, tenantId });
    });
    if (paymentsIds.length > 0) {
      await rewritePaymentGL.drain();
    }
  };

  /**
   * Rewrites the payments GL entries that associated to the given invoice.
   * @param   {number} tenantId
   * @param   {number} invoiceId
   * @param   {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public invoicePaymentsGLEntriesRewrite = async (
    tenantId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ) => {
    const { PaymentReceiveEntry } = this.tenancy.models(tenantId);

    const invoicePaymentEntries = await PaymentReceiveEntry.query().where(
      'invoiceId',
      invoiceId
    );
    const paymentsIds = invoicePaymentEntries.map((e) => e.paymentReceiveId);

    await this.rewritePaymentsGLEntriesQueue(tenantId, paymentsIds, trx);
  };
}
