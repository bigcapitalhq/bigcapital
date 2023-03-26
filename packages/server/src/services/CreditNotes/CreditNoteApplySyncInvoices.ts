import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import Knex from 'knex';
import Bluebird from 'bluebird';
import { ICreditNoteAppliedToInvoice } from '@/interfaces';

@Service()
export default class CreditNoteApplySyncInvoicesCreditedAmount {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Increment invoices credited amount.
   * @param {number} tenantId -
   * @param {ICreditNoteAppliedToInvoice[]} creditNoteAppliedInvoices -
   * @param {Knex.Transaction} trx -
   */
  public incrementInvoicesCreditedAmount = async (
    tenantId,
    creditNoteAppliedInvoices: ICreditNoteAppliedToInvoice[],
    trx?: Knex.Transaction
  ) => {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    await Bluebird.each(
      creditNoteAppliedInvoices,
      (creditNoteAppliedInvoice: ICreditNoteAppliedToInvoice) => {
        return SaleInvoice.query(trx)
          .where('id', creditNoteAppliedInvoice.invoiceId)
          .increment('creditedAmount', creditNoteAppliedInvoice.amount);
      }
    );
  };

  /**
   *
   * @param tenantId
   * @param invoicesIds
   * @param amount
   */
  public decrementInvoiceCreditedAmount = async (
    tenantId: number,
    invoiceId: number,
    amount: number,
    trx?: Knex.Transaction
  ) => {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    await SaleInvoice.query(trx)
      .findById(invoiceId)
      .decrement('creditedAmount', amount);
  };
}
