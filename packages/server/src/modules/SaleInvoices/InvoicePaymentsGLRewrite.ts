import { Knex } from 'knex';
import * as async from 'async';
import { Inject, Injectable } from '@nestjs/common';
import { PaymentReceivedGLEntries } from '../PaymentReceived/commands/PaymentReceivedGLEntries';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { PaymentReceivedEntry } from '../PaymentReceived/models/PaymentReceivedEntry';

@Injectable()
export class InvoicePaymentsGLEntriesRewrite {
  constructor(
    private readonly paymentGLEntries: PaymentReceivedGLEntries,

    @Inject(PaymentReceivedEntry.name)
    private readonly paymentReceivedEntryModel: TenantModelProxy<typeof PaymentReceivedEntry>
  ) {}

  /**
   * Rewrites the payment GL entries task.
   * @param   {{ tenantId: number, paymentId: number, trx: Knex?.Transaction }}
   * @returns {Promise<void>}
   */
  public rewritePaymentsGLEntriesTask = async ({
    paymentId,
    trx,
  }) => {
    await this.paymentGLEntries.rewritePaymentGLEntries(
      paymentId,
      trx
    );
  };

  /**
   * Rewrites the payment GL entries of the given payments ids.
   * @param {number[]} paymentsIds
   * @param {Knex.Transaction} trx
   */
  public rewritePaymentsGLEntriesQueue = async (
    paymentsIds: number[],
    trx?: Knex.Transaction
  ) => {
    // Initiate a new queue for accounts balance mutation.
    const rewritePaymentGL = async.queue(this.rewritePaymentsGLEntriesTask, 10);

    paymentsIds.forEach((paymentId: number) => {
      rewritePaymentGL.push({ paymentId, trx });
    });
    if (paymentsIds.length > 0) {
      await rewritePaymentGL.drain();
    }
  };

  /**
   * Rewrites the payments GL entries that associated to the given invoice.
   * @param {number} invoiceId
   * @param {Knex.Transaction} trx
   * @ {Promise<void>}
   */
  public invoicePaymentsGLEntriesRewrite = async (
    invoiceId: number,
    trx?: Knex.Transaction
  ) => {
    const invoicePaymentEntries = await this.paymentReceivedEntryModel()
      .query()
      .where('invoiceId', invoiceId);

    const paymentsIds = invoicePaymentEntries.map((e) => e.paymentReceiveId);

    await this.rewritePaymentsGLEntriesQueue(paymentsIds, trx);
  };
}
