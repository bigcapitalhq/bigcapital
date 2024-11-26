import { Transformer } from '@/lib/Transformer/Transformer';

export class GetSaleReceiptMailTemplateAttributesTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return [
      'companyLogoUri',
      'companyName',

      'primaryColor',

      'receiptAmount',
      'receiptMessage',

      'date',
      'dateLabel',

      'receiptNumber',
      'receiptNumberLabel',

      'total',
      'totalLabel',

      'subtotal',
      'subtotalLabel',

      'paidAmount',
      'paidAmountLabel',

      'items',
    ];
  };

  /**
   * Exclude all attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Company logo uri.
   * @returns {string}
   */
  public companyLogoUri(): string {
    return this.options.brandingTemplate?.companyLogoUri;
  }

  /**
   * Company name.
   * @returns {string}
   */
  public companyName(): string {
    return this.context.organization.name;
  }

  /**
   * Primary color
   * @returns {string}
   */
  public primaryColor(): string {
    return this.options?.brandingTemplate?.attributes?.primaryColor;
  }

  /**
   * Receipt number.
   * @returns {string}
   */
  public receiptNumber(): string {
    return this.options.receipt.receiptNumber;
  }

  /**
   * Receipt number label.
   * @returns {string}
   */
  public receiptNumberLabel(): string {
    return 'Receipt # {receiptNumber}';
  }

  /**
   * Date.
   * @returns {string}
   */
  public date(): string {
    return this.options.receipt.date;
  }

  /**
   * Date label.
   * @returns {string}
   */
  public dateLabel(): string {
    return 'Date';
  }

  /**
   * Receipt total.
   */
  public total(): string {
    return this.options.receipt.formattedAmount;
  }

  /**
   * Receipt total label.
   * @returns {string}
   */
  public totalLabel(): string {
    return 'Total';
  }

  /**
   * Receipt subtotal.
   * @returns {string}
   */
  public subtotal(): string {
    return this.options.receipt.formattedSubtotal;
  }

  /**
   * Receipt subtotal label.
   * @returns {string}
   */
  public subtotalLabel(): string {
    return 'Subtotal';
  }

  /**
   * Receipt mail items attributes.
   */
  public items(): any[] {
    return this.item(
      this.options.receipt.entries,
      new GetSaleReceiptMailTemplateEntryAttributesTransformer()
    );
  }
}

class GetSaleReceiptMailTemplateEntryAttributesTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return ['label', 'quantity', 'rate', 'total'];
  };

  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public label(entry): string {
    return entry?.item?.name;
  }

  public quantity(entry): string {
    return entry?.quantity;
  }

  public rate(entry): string {
    return entry?.rateFormatted;
  }

  public total(entry): string {
    return entry?.totalFormatted;
  }
}
