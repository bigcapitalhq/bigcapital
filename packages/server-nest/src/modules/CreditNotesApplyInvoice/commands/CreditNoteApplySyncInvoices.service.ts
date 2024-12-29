import { Knex } from 'knex';
import { Injectable, Inject } from '@nestjs/common';
import Bluebird from 'bluebird';
import { ICreditNoteAppliedToInvoice } from '../types/CreditNoteApplyInvoice.types';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { CreditNoteAppliedInvoice } from '../models/CreditNoteAppliedInvoice';

@Injectable()
export class CreditNoteApplySyncInvoicesCreditedAmount {
  /**
   * @param {typeof SaleInvoice} saleInvoiceModel - Sale invoice model.
   */
  constructor(
    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: typeof SaleInvoice,
  ) {}

  /**
   * Increment invoices credited amount.
   * @param {ICreditNoteAppliedToInvoice[]} creditNoteAppliedInvoices -
   * @param {Knex.Transaction} trx -
   */
  public incrementInvoicesCreditedAmount = async (
    creditNoteAppliedInvoices: ICreditNoteAppliedToInvoice[],
    trx?: Knex.Transaction
  ) => {
    await Bluebird.each(
      creditNoteAppliedInvoices,
      (creditNoteAppliedInvoice: CreditNoteAppliedInvoice) => {
        return this.saleInvoiceModel.query(trx)
          .where('id', creditNoteAppliedInvoice.invoiceId)
          .increment('creditedAmount', creditNoteAppliedInvoice.amount);
      }
    );
  };

  /**
   *
   * @param {number} invoicesIds
   * @param {number} amount - 
   * @param {Knex.Transaction} knex - 
   */
  public decrementInvoiceCreditedAmount = async (
    invoiceId: number,
    amount: number,
    trx?: Knex.Transaction
  ) => {
    await this.saleInvoiceModel.query(trx)
      .findById(invoiceId)
      .decrement('creditedAmount', amount);
  };
}
