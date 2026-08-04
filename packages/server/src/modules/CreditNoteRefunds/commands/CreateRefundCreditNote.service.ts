import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ICreditNoteRefundDTO,
  IRefundCreditNoteCreatedPayload,
  IRefundCreditNoteCreatingPayload,
} from '../types/CreditNoteRefunds.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RefundCreditNote } from '@/modules/CreditNoteRefunds/models/RefundCreditNote';
import { CommandCreditNoteDTOTransform } from '@/modules/CreditNotes/commands/CommandCreditNoteDTOTransform.service';
import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreditNoteRefundDto } from '../dto/CreditNoteRefund.dto';

@Injectable()
export class CreateRefundCreditNoteService {
  /**
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {CommandCreditNoteDTOTransform} commandCreditNoteDTOTransform - The command credit note DTO transform service.
   * @param {TenantModelProxy<typeof RefundCreditNote>} refundCreditNoteModel - The refund credit note model.
   * @param {TenantModelProxy<typeof Account>} accountModel - The account model.
   * @param {TenantModelProxy<typeof CreditNote>} creditNoteModel - The credit note model.
   */
  constructor(
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
    private commandCreditNoteDTOTransform: CommandCreditNoteDTOTransform,

    @Inject(RefundCreditNote.name)
    private refundCreditNoteModel: TenantModelProxy<typeof RefundCreditNote>,

    @Inject(Account.name)
    private accountModel: TenantModelProxy<typeof Account>,

    @Inject(CreditNote.name)
    private creditNoteModel: TenantModelProxy<typeof CreditNote>,
  ) {}

  /**
   * Retrieve the credit note graph.
   * @param {number} creditNoteId
   * @param {ICreditNoteRefundDTO} newCreditNoteDTO
   * @returns {Promise<IRefundCreditNote>}
   */
  public async createCreditNoteRefund(
    creditNoteId: number,
    newCreditNoteDTO: CreditNoteRefundDto,
  ): Promise<RefundCreditNote> {
    // Creates a refund credit note transaction.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the refund operation against the locked credit note row.
      const { creditNote } = await this.validate(
        creditNoteId,
        newCreditNoteDTO,
        trx,
      );
      // Triggers `onCreditNoteRefundCreating` event.
      await this.eventPublisher.emitAsync(events.creditNote.onRefundCreating, {
        trx,
        creditNote,
        newCreditNoteDTO,
      } as IRefundCreditNoteCreatingPayload);

      // Stores the refund credit note graph to the storage layer.
      const refundCreditNote = await this.refundCreditNoteModel()
        .query(trx)
        .insertAndFetch({
          ...this.transformDTOToModel(creditNote, newCreditNoteDTO),
        });
      // Triggers `onCreditNoteRefundCreated` event.
      await this.eventPublisher.emitAsync(events.creditNote.onRefundCreated, {
        trx,
        refundCreditNote,
        creditNote,
      } as IRefundCreditNoteCreatedPayload);

      return refundCreditNote;
    });
  }

  /**
   * Validates the refund credit note operation against the locked credit note row.
   * @param {number} creditNoteId - The credit note id.
   * @param {CreditNoteRefundDto} newCreditNoteDTO - The credit note refund DTO.
   * @param {Knex.Transaction} trx - Locks the credit note row (FOR UPDATE).
   * @returns {Promise<{ creditNote: CreditNote }>}
   */
  async validate(
    creditNoteId: number,
    newCreditNoteDTO: CreditNoteRefundDto,
    trx: Knex.Transaction,
  ): Promise<{ creditNote: CreditNote }> {
    // Retrieve the withdrawal account or throw not found service error.
    const fromAccount = await this.accountModel()
      .query(trx)
      .findById(newCreditNoteDTO.fromAccountId)
      .throwIfNotFound();

    // Validate the refund withdrawal account type.
    // this.commandCreditNoteDTOTransform.validateRefundWithdrawwalAccountType(
    //   fromAccount,
    // );
    // Retrieve the credit note with a row lock or throw not found service error.
    const creditNote = await this.creditNoteModel()
      .query(trx)
      .findById(creditNoteId)
      .forUpdate()
      .throwIfNotFound();

    // Validate the credit note remaining amount against the locked row.
    this.commandCreditNoteDTOTransform.validateCreditRemainingAmount(
      creditNote,
      newCreditNoteDTO.amount,
    );
    return { creditNote };
  }

  /**
   * Transformes the refund credit note DTO to model.
   * @param {CreditNote} creditNote - The credit note.
   * @param {CreditNoteRefundDto} creditNoteDTO - The credit note refund DTO.
   * @returns {Partial<RefundCreditNote>}
   */
  private transformDTOToModel = (
    creditNote: CreditNote,
    creditNoteDTO: CreditNoteRefundDto,
  ): Partial<RefundCreditNote> => {
    return {
      creditNoteId: creditNote.id,
      currencyCode: creditNote.currencyCode,
      ...creditNoteDTO,
      exchangeRate: creditNoteDTO.exchangeRate || 1,
    };
  };
}
