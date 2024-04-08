import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '../../utils';
import { ItemEntryTransformer } from '../Sales/Invoices/ItemEntryTransformer';

export class CreditNoteTransformer extends Transformer {
  /**
   * Include these attributes to sale credit note object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedCreditsRemaining',
      'formattedCreditNoteDate',
      'formattedAmount',
      'formattedCreditsUsed',
      'formattedSubtotal',
      'entries',
    ];
  };

  /**
   * Retrieve formatted credit note date.
   * @param {ICreditNote} credit
   * @returns {String}
   */
  protected formattedCreditNoteDate = (credit): string => {
    return this.formatDate(credit.creditNoteDate);
  };

  /**
   * Retrieve formatted invoice amount.
   * @param {ICreditNote} credit
   * @returns {string}
   */
  protected formattedAmount = (credit): string => {
    return formatNumber(credit.amount, {
      currencyCode: credit.currencyCode,
    });
  };

  /**
   * Retrieve formatted credits remaining.
   * @param {ICreditNote} credit
   * @returns {string}
   */
  protected formattedCreditsRemaining = (credit) => {
    return formatNumber(credit.creditsRemaining, {
      currencyCode: credit.currencyCode,
    });
  };

  /**
   * Retrieve formatted credits used.
   * @param {ICreditNote} credit
   * @returns {string}
   */
  protected formattedCreditsUsed = (credit) => {
    return formatNumber(credit.creditsUsed, {
      currencyCode: credit.currencyCode,
    });
  };

  /**
   * Retrieves the formatted subtotal.
   * @param {ICreditNote} credit
   * @returns {string}
   */
  protected formattedSubtotal = (credit): string => {
    return formatNumber(credit.amount, { money: false });
  };

  /**
   * Retrieves the entries of the credit note.
   * @param {ICreditNote} credit
   * @returns {}
   */
  protected entries = (credit) => {
    return this.item(credit.entries, new ItemEntryTransformer(), {
      currencyCode: credit.currencyCode,
    });
  };
}
