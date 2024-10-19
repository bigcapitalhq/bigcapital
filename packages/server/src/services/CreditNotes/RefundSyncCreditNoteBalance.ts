import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';

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
