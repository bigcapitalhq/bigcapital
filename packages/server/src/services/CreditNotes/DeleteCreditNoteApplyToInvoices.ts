import { Service, Inject } from 'typedi';
import Knex from 'knex';
import { IApplyCreditToInvoicesDeletedPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import PaymentReceiveService from '@/services/Sales/PaymentReceives/PaymentsReceives';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import BaseCreditNotes from './CreditNotes';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';

@Service()
export default class DeleteCreditNoteApplyToInvoices extends BaseCreditNotes {
  @Inject('PaymentReceives')
  paymentReceive: PaymentReceiveService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Apply credit note to the given invoices.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @param {IApplyCreditToInvoicesDTO} applyCreditToInvoicesDTO
   */
  public deleteApplyCreditNoteToInvoices = async (
    tenantId: number,
    applyCreditToInvoicesId: number
  ): Promise<void> => {
    const { CreditNoteAppliedInvoice } = this.tenancy.models(tenantId);

    const creditNoteAppliedToInvoice =
      await CreditNoteAppliedInvoice.query().findById(applyCreditToInvoicesId);

    if (!creditNoteAppliedToInvoice) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_APPLY_TO_INVOICES_NOT_FOUND);
    }
    // Retrieve the credit note or throw not found service error.
    const creditNote = await this.getCreditNoteOrThrowError(
      tenantId,
      creditNoteAppliedToInvoice.creditNoteId
    );
    // Creates credit note apply to invoice transaction.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Delete credit note applied to invoices.
      await CreditNoteAppliedInvoice.query(trx)
        .findById(applyCreditToInvoicesId)
        .delete();

      // Triggers `onCreditNoteApplyToInvoiceDeleted` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onApplyToInvoicesDeleted,
        {
          trx,
          creditNote,
          creditNoteAppliedToInvoice,
          tenantId,
        } as IApplyCreditToInvoicesDeletedPayload
      );
    });
  };
}
