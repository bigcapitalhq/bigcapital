import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { sumBy } from 'lodash';
import {
  ICreditNoteAppliedToInvoice,
  ICreditNoteAppliedToInvoiceModel,
  IApplyCreditToInvoicesDTO,
  IApplyCreditToInvoicesCreatedPayload,
} from '../types/CreditNoteApplyInvoice.types';
import { ERRORS } from '../../CreditNotes/constants';
import { PaymentReceivedValidators } from '@/modules/PaymentReceived/commands/PaymentReceivedValidators.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { ServiceError } from '@/modules/Items/ServiceError';
import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';
import { CreditNoteAppliedInvoice } from '../models/CreditNoteAppliedInvoice';
import { CommandCreditNoteDTOTransform } from '@/modules/CreditNotes/commands/CommandCreditNoteDTOTransform.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ApplyCreditNoteToInvoicesDto } from '../dtos/ApplyCreditNoteToInvoices.dto';

@Injectable()
export class CreditNoteApplyToInvoices {
  /**
   * @param {PaymentReceivedValidators} paymentReceiveValidators - The payment received validators service.
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {typeof CreditNoteAppliedInvoice} creditNoteAppliedInvoiceModel - The credit note applied invoice model.
   */
  constructor(
    private readonly paymentReceiveValidators: PaymentReceivedValidators,
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly creditNoteDTOTransform: CommandCreditNoteDTOTransform,

    @Inject(CreditNoteAppliedInvoice.name)
    private readonly creditNoteAppliedInvoiceModel: TenantModelProxy<
      typeof CreditNoteAppliedInvoice
    >,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: TenantModelProxy<typeof CreditNote>,
  ) {}

  /**
   * Apply credit note to the given invoices.
   * @param {number} creditNoteId
   * @param {IApplyCreditToInvoicesDTO} applyCreditToInvoicesDTO
   */
  public async applyCreditNoteToInvoices(
    creditNoteId: number,
    applyCreditToInvoicesDTO: ApplyCreditNoteToInvoicesDto,
  ): Promise<CreditNoteAppliedInvoice[]> {
    // Creates credit note apply to invoice transaction.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the apply operation against the locked credit note
      // and invoices rows.
      const { creditNote, creditNoteAppliedModel } = await this.validate(
        creditNoteId,
        applyCreditToInvoicesDTO,
        trx,
      );
      // Saves the credit note apply to invoice graph to the storage layer.
      const creditNoteAppliedInvoices =
        await this.creditNoteAppliedInvoiceModel()
          .query(trx)
          .insertGraph(creditNoteAppliedModel.entries);

      // Triggers `onCreditNoteApplyToInvoiceCreated` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onApplyToInvoicesCreated,
        {
          creditNote,
          creditNoteAppliedInvoices,
          trx,
        } as IApplyCreditToInvoicesCreatedPayload,
      );

      return creditNoteAppliedInvoices;
    });
  }

  /**
   * Validates the apply credit note to invoices operation against the locked
   * credit note and invoices rows.
   * @param {number} creditNoteId - The credit note id.
   * @param {ApplyCreditNoteToInvoicesDto} applyCreditToInvoicesDTO - Apply DTO.
   * @param {Knex.Transaction} trx - Locks the credit note and invoice rows (FOR UPDATE).
   * @returns {Promise<{ creditNote: CreditNote, creditNoteAppliedModel: ICreditNoteAppliedToInvoiceModel }>}
   */
  async validate(
    creditNoteId: number,
    applyCreditToInvoicesDTO: ApplyCreditNoteToInvoicesDto,
    trx: Knex.Transaction,
  ): Promise<{
    creditNote: CreditNote;
    creditNoteAppliedModel: ICreditNoteAppliedToInvoiceModel;
  }> {
    // Retrieves the credit note with a row lock or throw not found service error.
    const creditNote = await this.creditNoteModel()
      .query(trx)
      .findById(creditNoteId)
      .forUpdate()
      .throwIfNotFound();

    // Retrieve the applied invoices (locked) that associated to the credit note customer.
    const appliedInvoicesEntries =
      await this.paymentReceiveValidators.validateInvoicesIDsExistance(
        creditNote.customerId,
        applyCreditToInvoicesDTO.entries,
        trx,
      );

    // Transformes apply DTO to model.
    const creditNoteAppliedModel = this.transformApplyDTOToModel(
      applyCreditToInvoicesDTO,
      creditNote,
    );
    // Validate invoices has remaining amount to apply.
    this.validateInvoicesRemainingAmount(
      appliedInvoicesEntries,
      creditNoteAppliedModel.entries,
    );
    // Validate the credit note remaining amount against the locked row.
    this.creditNoteDTOTransform.validateCreditRemainingAmount(
      creditNote,
      creditNoteAppliedModel.amount,
    );
    return { creditNote, creditNoteAppliedModel };
  }

  /**
   * Transformes apply DTO to model.
   * @param {IApplyCreditToInvoicesDTO} applyDTO
   * @param {ICreditNote} creditNote
   * @returns
   */
  private transformApplyDTOToModel = (
    applyDTO: IApplyCreditToInvoicesDTO,
    creditNote: CreditNote,
  ): ICreditNoteAppliedToInvoiceModel => {
    const entries = applyDTO.entries.map((entry) => ({
      invoiceId: entry.invoiceId,
      amount: entry.amount,
      creditNoteId: creditNote.id,
    }));
    return {
      amount: sumBy(entries, 'amount'),
      entries,
    };
  };

  /**
   * Validate each invoice has sufficient remaining amount for the applied credit.
   * @param {ISaleInvoice[]} invoices
   * @param {ICreditNoteAppliedToInvoice[]} entries
   */
  private validateInvoicesRemainingAmount = (
    invoices: SaleInvoice[],
    entries: ICreditNoteAppliedToInvoice[],
  ) => {
    const invoiceMap = new Map(invoices.map((inv) => [inv.id, inv]));
    const invalidEntries = entries.filter((entry) => {
      const invoice = invoiceMap.get(entry.invoiceId);
      return invoice != null && invoice.dueAmount < entry.amount;
    });
    if (invalidEntries.length > 0) {
      throw new ServiceError(ERRORS.INVOICES_HAS_NO_REMAINING_AMOUNT);
    }
  };
}
