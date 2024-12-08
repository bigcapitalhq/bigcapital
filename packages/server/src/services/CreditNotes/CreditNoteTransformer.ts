import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';
import { ItemEntryTransformer } from '../Sales/Invoices/ItemEntryTransformer';
import { ICreditNote } from '@/interfaces';
import { AttachmentTransformer } from '../Attachments/AttachmentTransformer';

export class CreditNoteTransformer extends Transformer {
  /**
   * Include these attributes to sale credit note object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedCreditsRemaining',
      'formattedCreditNoteDate',
      'formattedCreatedAt',
      'formattedCreatedAt',
      'formattedAmount',
      'formattedCreditsUsed',
      'formattedSubtotal',

      'discountAmountFormatted',
      'discountAmountLocalFormatted',

      'discountPercentageFormatted',

      'adjustmentFormatted',
      'adjustmentLocalFormatted',

      'totalFormatted',
      'totalLocalFormatted',

      'entries',
      'attachments',
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
   * Retrieve formatted created at date.
   * @param credit
   * @returns {string}
   */
  protected formattedCreatedAt = (credit): string => {
    return this.formatDate(credit.createdAt);
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
   * Retrieves formatted discount amount.
   * @param credit
   * @returns {string}
   */
  protected discountAmountFormatted = (credit): string => {
    return formatNumber(credit.discountAmount, {
      currencyCode: credit.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted discount amount in local currency.
   * @param {ICreditNote} credit
   * @returns {string}
   */
  protected discountAmountLocalFormatted = (credit): string => {
    return formatNumber(credit.discountAmountLocal, {
      currencyCode: credit.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves formatted discount percentage.
   * @param credit
   * @returns {string}
   */
  protected discountPercentageFormatted = (credit): string => {
    return credit.discountPercentage ? `${credit.discountPercentage}%` : '';
  };

  /**
   * Retrieves formatted adjustment amount.
   * @param credit
   * @returns {string}
   */
  protected adjustmentFormatted = (credit): string => {
    return this.formatMoney(credit.adjustment, {
      currencyCode: credit.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted adjustment amount in local currency.
   * @param {ICreditNote} credit
   * @returns {string}
   */
  protected adjustmentLocalFormatted = (credit): string => {
    return formatNumber(credit.adjustmentLocal, {
      currencyCode: this.context.organization.baseCurrency,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted total.
   * @param credit
   * @returns {string}
   */
  protected totalFormatted = (credit): string => {
    return formatNumber(credit.total, {
      currencyCode: credit.currencyCode,
    });
  };

  /**
   * Retrieves the formatted total in local currency.
   * @param credit
   * @returns {string}
   */
  protected totalLocalFormatted = (credit): string => {
    return formatNumber(credit.totalLocal, {
      currencyCode: credit.currencyCode,
    });
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

  /**
   * Retrieves the credit note attachments.
   * @param {ISaleInvoice} invoice
   * @returns
   */
  protected attachments = (creditNote) => {
    return this.item(creditNote.attachments, new AttachmentTransformer());
  };
}
