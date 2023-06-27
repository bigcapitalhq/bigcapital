import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import {
  ICreditNote,
  ICreditNoteRefundDTO,
  IRefundCreditNote,
  IRefundCreditNoteCreatedPayload,
  IRefundCreditNoteCreatingPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import RefundCreditNote from './RefundCreditNote';

@Service()
export default class CreateRefundCreditNote extends RefundCreditNote {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Retrieve the credit note graph.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<IRefundCreditNote>}
   */
  public createCreditNoteRefund = async (
    tenantId: number,
    creditNoteId: number,
    newCreditNoteDTO: ICreditNoteRefundDTO
  ): Promise<IRefundCreditNote> => {
    const { RefundCreditNote, Account } = this.tenancy.models(tenantId);

    // Retrieve the credit note or throw not found service error.
    const creditNote = await this.getCreditNoteOrThrowError(
      tenantId,
      creditNoteId
    );
    // Retrieve the withdrawal account or throw not found service error.
    const fromAccount = await Account.query()
      .findById(newCreditNoteDTO.fromAccountId)
      .throwIfNotFound();

    // Validate the credit note remaining amount.
    this.validateCreditRemainingAmount(creditNote, newCreditNoteDTO.amount);

    // Validate the refund withdrawal account type.
    this.validateRefundWithdrawalAccountType(fromAccount);

    // Creates a refund credit note transaction.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCreditNoteRefundCreating` event.
      await this.eventPublisher.emitAsync(events.creditNote.onRefundCreating, {
        trx,
        creditNote,
        tenantId,
        newCreditNoteDTO,
      } as IRefundCreditNoteCreatingPayload);

      // Stores the refund credit note graph to the storage layer.
      const refundCreditNote = await RefundCreditNote.query(trx).insertAndFetch(
        {
          ...this.transformDTOToModel(creditNote, newCreditNoteDTO),
        }
      );
      // Triggers `onCreditNoteRefundCreated` event.
      await this.eventPublisher.emitAsync(events.creditNote.onRefundCreated, {
        trx,
        refundCreditNote,
        creditNote,
        tenantId,
      } as IRefundCreditNoteCreatedPayload);

      return refundCreditNote;
    });
  };

  /**
   * Transforms the refund credit note DTO to model.
   * @param {number} creditNoteId
   * @param {ICreditNoteRefundDTO} creditNoteDTO
   * @returns {ICreditNote}
   */
  private transformDTOToModel = (
    creditNote: ICreditNote,
    creditNoteDTO: ICreditNoteRefundDTO
  ): IRefundCreditNote => {
    return {
      creditNoteId: creditNote.id,
      currencyCode: creditNote.currencyCode,
      ...creditNoteDTO,
      exchangeRate: creditNoteDTO.exchangeRate || 1,
    };
  };
}
