import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import {
  IApplyCreditToInvoicesCreatedPayload,
  IApplyCreditToInvoicesDeletedPayload,
} from '@/interfaces';
import CreditNoteApplySyncInvoicesCreditedAmount from './CreditNoteApplySyncInvoices';

@Service()
export default class CreditNoteApplySyncInvoicesCreditedAmountSubscriber {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  syncInvoicesWithCreditNote: CreditNoteApplySyncInvoicesCreditedAmount;

  /**
   * Attaches events with handlers.
   */
  attach(bus) {
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
