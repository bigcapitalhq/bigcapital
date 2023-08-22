import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import {
  IApplyCreditToInvoicesCreatedPayload,
  IApplyCreditToInvoicesDeletedPayload,
} from '@/interfaces';
import CreditNoteApplySyncInvoicesCreditedAmount from './CreditNoteApplySyncInvoices';

@Service()
export default class CreditNoteApplySyncInvoicesCreditedAmountSubscriber {
  @Inject()
  private syncInvoicesWithCreditNote: CreditNoteApplySyncInvoicesCreditedAmount;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.creditNote.onApplyToInvoicesCreated,
      this.incrementAppliedInvoicesOnceCreditCreated
    );
    bus.subscribe(
      events.creditNote.onApplyToInvoicesDeleted,
      this.decrementAppliedInvoicesOnceCreditDeleted
    );
  }

  /**
   * Increment invoices credited amount once the credit note apply to invoices transaction
   * @param {IApplyCreditToInvoicesCreatedPayload} payload -
   */
  private incrementAppliedInvoicesOnceCreditCreated = async ({
    trx,
    tenantId,
    creditNoteAppliedInvoices,
  }: IApplyCreditToInvoicesCreatedPayload) => {
    await this.syncInvoicesWithCreditNote.incrementInvoicesCreditedAmount(
      tenantId,
      creditNoteAppliedInvoices,
      trx
    );
  };

  /**
   *
   * @param {IApplyCreditToInvoicesDeletedPayload} payload -
   */
  private decrementAppliedInvoicesOnceCreditDeleted = async ({
    trx,
    creditNoteAppliedToInvoice,
    tenantId,
  }: IApplyCreditToInvoicesDeletedPayload) => {
    // Decrement invoice credited amount.
    await this.syncInvoicesWithCreditNote.decrementInvoiceCreditedAmount(
      tenantId,
      creditNoteAppliedToInvoice.invoiceId,
      creditNoteAppliedToInvoice.amount,
      trx
    );
  };
}
