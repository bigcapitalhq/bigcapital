import Knex from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';

@Service()
export default class CreditNoteApplySyncCredit {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Increment credit note invoiced amount.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @param {number} invoicesAppliedAmount
   */
  public incrementCreditNoteInvoicedAmount = async (
    tenantId: number,
    creditNoteId: number,
    invoicesAppliedAmount: number,
    trx?: Knex.Transaction
  ) => {
    const { CreditNote } = this.tenancy.models(tenantId);

    await CreditNote.query(trx)
      .findById(creditNoteId)
      .increment('invoicesAmount', invoicesAppliedAmount);
  };

  /**
   * Decrement credit note invoiced amount.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @param {number} invoicesAppliedAmount
   */
  public decrementCreditNoteInvoicedAmount = async (
    tenantId: number,
    creditNoteId: number,
    invoicesAppliedAmount: number,
    trx?: Knex.Transaction
  ) => {
    const { CreditNote } = this.tenancy.models(tenantId);

    await CreditNote.query(trx)
      .findById(creditNoteId)
      .decrement('invoicesAmount', invoicesAppliedAmount);
  };
}
