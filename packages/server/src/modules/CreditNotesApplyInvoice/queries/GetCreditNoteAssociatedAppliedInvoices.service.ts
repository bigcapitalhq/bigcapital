import { Inject, Injectable } from '@nestjs/common';
import { CreditNoteAppliedInvoiceTransformer } from './CreditNoteAppliedInvoiceTransformer';
import { CreditNote } from '../../CreditNotes/models/CreditNote';
import { TransformerInjectable } from '../../Transformer/TransformerInjectable.service';
import { CreditNoteAppliedInvoice } from '../models/CreditNoteAppliedInvoice';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetCreditNoteAssociatedAppliedInvoices {
  /**
   * @param {TransformerInjectable} transformer - The transformer service.
   * @param {TenantModelProxy<typeof CreditNoteAppliedInvoice>} creditNoteAppliedInvoiceModel - The credit note applied invoice model.
   * @param {TenantModelProxy<typeof CreditNote>} creditNoteModel - The credit note model.
   */
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(CreditNoteAppliedInvoice.name)
    private readonly creditNoteAppliedInvoiceModel: TenantModelProxy<typeof CreditNoteAppliedInvoice>,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: TenantModelProxy<typeof CreditNote>,
  ) {}

  /**
   * Retrieve credit note associated invoices to apply.
   * @param {number} creditNoteId
   * @returns {Promise<CreditNoteAppliedInvoice[]>}
   */
  public async getCreditAssociatedAppliedInvoices(
    creditNoteId: number,
  ): Promise<CreditNoteAppliedInvoice[]> {
    // Retrieve credit note or throw not found service error.
    const creditNote = await this.creditNoteModel()
      .query()
      .findById(creditNoteId)
      .throwIfNotFound();

    const appliedToInvoices = await this.creditNoteAppliedInvoiceModel()
      .query()
      .where('credit_note_id', creditNoteId)
      .withGraphFetched('saleInvoice')
      .withGraphFetched('creditNote');

    // Transforms credit note applied to invoices.
    return this.transformer.transform(
      appliedToInvoices,
      new CreditNoteAppliedInvoiceTransformer(),
    );
  }
}
