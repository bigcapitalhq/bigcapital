import Knex from 'knex';
import { IRefundCreditNote } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export default class RefundSyncCreditNoteBalance {
  @Inject()
  tenancy: HasTenancyService;

  /**
   *
   * @param {number} tenantId
   * @param {IRefundCreditNote} refundCreditNote
   * @param {Knex.Transaction} trx
   */
  public incrementCreditNoteRefundAmount = async (
    tenantId: number,
    creditNoteId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { CreditNote } = this.tenancy.models(tenantId);

    await CreditNote.query(trx)
      .findById(creditNoteId)
      .increment('refunded_amount', amount);
  };

  /**
   *
   * @param {number} tenantId
   * @param {IRefundCreditNote} refundCreditNote
   * @param {Knex.Transaction} trx
   */
  public decrementCreditNoteRefundAmount = async (
    tenantId: number,
    creditNoteId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { CreditNote } = this.tenancy.models(tenantId);

    await CreditNote.query(trx)
      .findById(creditNoteId)
      .decrement('refunded_amount', amount);
  };
}
