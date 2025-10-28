import { sumBy } from 'lodash';
import { Injectable } from '@nestjs/common';
import {
  IApplyCreditToInvoicesCreatedPayload,
  IApplyCreditToInvoicesDeletedPayload,
} from '../types/CreditNoteApplyInvoice.types';
import { CreditNoteApplySyncCredit } from '../commands/CreditNoteApplySyncCredit.service';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class CreditNoteApplySyncCreditSubscriber {
  constructor(
    private readonly syncInvoicedAmountWithCredit: CreditNoteApplySyncCredit,
  ) {}

  /**
   * Increment credited amount of credit note transaction once the transaction created.
   * @param {IApplyCreditToInvoicesCreatedPayload} payload -
   */
  @OnEvent(events.creditNote.onApplyToInvoicesCreated)
  async incrementCreditedAmountOnceApplyToInvoicesCreated({
    trx,
    creditNote,
    creditNoteAppliedInvoices,
  }: IApplyCreditToInvoicesCreatedPayload) {
    const totalCredited = sumBy(creditNoteAppliedInvoices, 'amount');

    await this.syncInvoicedAmountWithCredit.incrementCreditNoteInvoicedAmount(
      creditNote.id,
      totalCredited,
      trx,
    );
  }

  /**
   * Decrement credited amount of credit note transaction once the transaction deleted.
   * @param {IApplyCreditToInvoicesDeletedPayload} payload -
   */
  @OnEvent(events.creditNote.onApplyToInvoicesDeleted)
  async decrementCreditedAmountOnceApplyToInvoicesDeleted({
    creditNote,
    creditNoteAppliedToInvoice,
    trx,
  }: IApplyCreditToInvoicesDeletedPayload) {
    await this.syncInvoicedAmountWithCredit.decrementCreditNoteInvoicedAmount(
      creditNote.id,
      creditNoteAppliedToInvoice.amount,
      trx,
    );
  }
}
