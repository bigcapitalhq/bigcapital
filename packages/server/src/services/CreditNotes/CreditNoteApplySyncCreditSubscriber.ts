import { Service, Inject } from 'typedi';
import { sumBy } from 'lodash';
import events from '@/subscribers/events';
import {
  IApplyCreditToInvoicesCreatedPayload,
  IApplyCreditToInvoicesDeletedPayload,
} from '@/interfaces';
import CreditNoteApplySyncCredit from './CreditNoteApplySyncCredit';

@Service()
export default class CreditNoteApplySyncCreditSubscriber {
  @Inject()
  syncInvoicedAmountWithCredit: CreditNoteApplySyncCredit;

  /**
   *
   * @param bus
   */
  attach(bus) {
    bus.subscribe(
      events.creditNote.onApplyToInvoicesCreated,
      this.incrementCreditedAmountOnceApplyToInvoicesCreated
    );
    bus.subscribe(
      events.creditNote.onApplyToInvoicesDeleted,
      this.decrementCreditedAmountOnceApplyToInvoicesDeleted
    );
  }

  /**
   * Increment credited amount of credit note transaction once the transaction created.
   * @param {IApplyCreditToInvoicesCreatedPayload} payload -
   */
  private incrementCreditedAmountOnceApplyToInvoicesCreated = async ({
    trx,
    creditNote,
    tenantId,
    creditNoteAppliedInvoices,
  }: IApplyCreditToInvoicesCreatedPayload) => {
    const totalCredited = sumBy(creditNoteAppliedInvoices, 'amount');

    await this.syncInvoicedAmountWithCredit.incrementCreditNoteInvoicedAmount(
      tenantId,
      creditNote.id,
      totalCredited,
      trx
    );
  };

  /**
   * Decrement credited amount of credit note transaction once the transaction deleted.
   * @param {IApplyCreditToInvoicesDeletedPayload} payload -
   */
  private decrementCreditedAmountOnceApplyToInvoicesDeleted = async ({
    tenantId,
    creditNote,
    creditNoteAppliedToInvoice,
    trx,
  }: IApplyCreditToInvoicesDeletedPayload) => {
    await this.syncInvoicedAmountWithCredit.decrementCreditNoteInvoicedAmount(
      tenantId,
      creditNote.id,
      creditNoteAppliedToInvoice.amount,
      trx
    );
  };
}
