import { ItemEntryTransformer } from '@/modules/TransactionItemEntry/ItemEntry.transformer';
import { CreditNoteTransformer } from './CreditNoteTransformer';

export class GetCreditNoteMailStateTransformer extends CreditNoteTransformer {
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public includeAttributes = (): string[] => {
    return [
      'creditNoteDate',
      'creditNoteDateFormatted',

      'total',
      'totalFormatted',

      'subtotal',
      'subtotalFormatted',

      'discountAmount',
      'discountAmountFormatted',
      'discountPercentage',
      'discountPercentageFormatted',
      'discountLabel',

      'adjustment',
      'adjustmentFormatted',
      'adjustmentLabel',

      'creditNoteNumber',
      'entries',

      'companyName',
      'companyLogoUri',

      'primaryColor',
      'customerName',
    ];
  };

  /**
   * Retrieves the customer name of the credit note.
   * @param creditNote
   * @returns {string}
   */
  protected customerName = (creditNote) => {
    return creditNote.customer.displayName;
  };

  /**
   * Retrieves the company name.
   * @returns {string}
   */
  protected companyName = () => {
    return this.context.organization.name;
  };

  /**
   * Retrieves the company logo uri.
   * @param creditNote
   * @returns {string | null}
   */
  protected companyLogoUri = (creditNote) => {
    return creditNote.pdfTemplate?.companyLogoUri || null;
  };

  /**
   * Retrieves the primary color.
   * @param creditNote
   * @returns {string | null}
   */
  protected primaryColor = (creditNote) => {
    return creditNote.pdfTemplate?.attributes?.primaryColor || null;
  };

  /**
   * Retrieves the formatted credit note date.
   * @param creditNote
   * @returns {string}
   */
  protected creditNoteDateFormatted = (creditNote) => {
    return this.formattedCreditNoteDate(creditNote);
  };

  /**
   * Retrieves the total amount of the credit note.
   * @param creditNote
   * @returns {number}
   */
  protected total(creditNote) {
    return creditNote.amount;
  }

  /**
   * Retrieves the subtotal amount of the credit note.
   * @param creditNote
   * @returns {number}
   */
  protected subtotal(creditNote) {
    return creditNote.amount;
  }

  /**
   * Retrieves the formatted subtotal of the credit note.
   * @param creditNote
   * @returns {string}
   */
  protected subtotalFormatted = (creditNote) => {
    return this.formattedSubtotal(creditNote);
  };

  /**
   * Retrieves the discount label of the credit note.
   * @param creditNote
   * @returns {string}
   */
  protected discountLabel(creditNote) {
    return creditNote.discountType === 'percentage'
      ? `Discount [${creditNote.discountPercentageFormatted}]`
      : 'Discount';
  }

  /**
   * Retrieves the adjustment label of the credit note.
   * @param creditNote
   * @returns {string}
   */
  protected adjustmentLabel() {
    return 'Adjustment';
  }

  /**
   * Retrieves the credit note entries.
   * @param creditNote
   * @returns {Array}
   */
  protected entries = (creditNote) => {
    return this.item(
      creditNote.entries,
      new GetCreditNoteMailStateEntryTransformer(),
      {
        currencyCode: creditNote.currencyCode,
      },
    );
  };

  /**
   * Merges the mail options with the credit note object.
   */
  public transform = (object: any) => {
    return {
      ...this.options.mailOptions,
      ...object,
    };
  };
}

class GetCreditNoteMailStateEntryTransformer extends ItemEntryTransformer {
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Item name.
   * @param entry
   * @returns
   */
  public name = (entry) => {
    return entry.item.name;
  };

  public includeAttributes = (): string[] => {
    return [
      'name',
      'quantity',
      'unitPrice',
      'unitPriceFormatted',
      'total',
      'totalFormatted',
    ];
  };
}
