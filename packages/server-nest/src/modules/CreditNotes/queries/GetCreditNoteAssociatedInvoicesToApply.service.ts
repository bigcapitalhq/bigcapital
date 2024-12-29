import { Inject, Injectable } from '@nestjs/common';
import { CreditNoteWithInvoicesToApplyTransformer } from '../commands/CreditNoteWithInvoicesToApplyTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { GetCreditNote } from './GetCreditNote.service';

@Injectable()
export class GetCreditNoteAssociatedInvoicesToApply {
  constructor(
    private transformer: TransformerInjectable,
    private getCreditNote: GetCreditNote,

    @Inject(SaleInvoice.name)
    private saleInvoiceModel: typeof SaleInvoice,
  ) {}

  /**
   * Retrieve credit note associated invoices to apply.
   * @param {number} creditNoteId
   * @returns {Promise<ISaleInvoice[]>}
   */
  public async getCreditAssociatedInvoicesToApply(
    creditNoteId: number,
  ): Promise<SaleInvoice[]> {
    // Retrieve credit note or throw not found service error.
    const creditNote = await this.getCreditNote.getCreditNote(creditNoteId);

    // Retrieves the published due invoices that associated to the given customer.
    const saleInvoices = await this.saleInvoiceModel
      .query()
      .where('customerId', creditNote.customerId)
      .modify('dueInvoices')
      .modify('published');

    // Transforms the sale invoices models to POJO.
    return this.transformer.transform(
      saleInvoices,
      new CreditNoteWithInvoicesToApplyTransformer(),
    );
  }
}
