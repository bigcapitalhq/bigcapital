import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  IApplyCreditToInvoicesCreatedPayload,
  IApplyCreditToInvoicesDeletedPayload,
} from '../types/CreditNoteApplyInvoice.types';
import { CreditNoteApplySyncInvoicesCreditedAmount } from '../commands/CreditNoteApplySyncInvoices.service';
import { events } from '@/common/events/events';

@Injectable()
export default class CreditNoteApplySyncInvoicesCreditedAmountSubscriber {
  constructor(
    private readonly syncInvoicesWithCreditNote: CreditNoteApplySyncInvoicesCreditedAmount,
  ) {}

  /**
   * Increment invoices credited amount once the credit note apply to invoices transaction
   * @param {IApplyCreditToInvoicesCreatedPayload} payload -
   */
  @OnEvent(events.creditNote.onApplyToInvoicesCreated)
  async incrementAppliedInvoicesOnceCreditCreated({
    trx,
    creditNoteAppliedInvoices,
  }: IApplyCreditToInvoicesCreatedPayload) {
    await this.syncInvoicesWithCreditNote.incrementInvoicesCreditedAmount(
      creditNoteAppliedInvoices,
      trx,
    );
  }

  /**
   *
   * @param {IApplyCreditToInvoicesDeletedPayload} payload -
   */
  @OnEvent(events.creditNote.onApplyToInvoicesDeleted)
  async decrementAppliedInvoicesOnceCreditDeleted({
    trx,
    creditNoteAppliedToInvoice,
  }: IApplyCreditToInvoicesDeletedPayload) {
    // Decrement invoice credited amount.
    await this.syncInvoicesWithCreditNote.decrementInvoiceCreditedAmount(
      creditNoteAppliedToInvoice.invoiceId,
      creditNoteAppliedToInvoice.amount,
      trx,
    );
  }
}
