import { Knex } from 'knex';
import async from 'async';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { BillPaymentGLEntries } from '../BillPayments/BillPaymentGLEntries';

@Service()
export class BillPaymentsGLEntriesRewrite {
  @Inject()
  public tenancy: HasTenancyService;

  @Inject()
  public paymentGLEntries: BillPaymentGLEntries;

  /**
   * Rewrites payments GL entries that associated to the given bill.
   * @param {number} tenantId
   * @param {number} billId
   * @param {Knex.Transaction} trx
   */
  public rewriteBillPaymentsGLEntries = async (
    tenantId: number,
    billId: number,
    trx?: Knex.Transaction
  ) => {
    const { BillPaymentEntry } = this.tenancy.models(tenantId);

    const billPaymentEntries = await BillPaymentEntry.query().where(
      'billId',
      billId
    );
    const paymentsIds = billPaymentEntries.map((e) => e.billPaymentId);

    await this.rewritePaymentsGLEntriesQueue(tenantId, paymentsIds, trx);
  };

  /**
   * Rewrites the payments GL entries under async queue.
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
    //
    if (paymentsIds.length > 0) await rewritePaymentGL.drain();
  };

  /**
   * Rewrites the payments GL entries task.
   * @param {number} tenantId -
   * @param {number} paymentId -
   * @param {Knex.Transaction} trx -
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
}
