import { Transformer } from '@/lib/Transformer/Transformer';

export class GetPaymentReceivedMailTemplateAttrsTransformer extends Transformer {
  /**
   * Included attributes.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'companyLogoUri',
      'companyName',
      'primaryColor',
      'total',
      'totalLabel',
      'subtotal',
      'subtotalLabel',
      'paymentNumberLabel',
      'paymentNumber',
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
   * Total.
   * @returns {string}
   */
  public total(): string {
    return this.options.paymentReceived.formattedAmount;
  }

  /**
   * Total label.
   * @returns {string}
   */
  public totalLabel(): string {
    return 'Total';
  }

  /**
   * Subtotal.
   * @returns {string}
   */
  public subtotal(): string {
    return this.options.paymentReceived.formattedAmount;
  }

  /**
   * Subtotal label.
   * @returns {string}
   */
  public subtotalLabel(): string {
    return 'Subtotal';
  }

  /**
   * Payment number label.
   * @returns {string}
   */
  public paymentNumberLabel(): string {
    return 'Payment # {paymentNumber}';
  }

  /**
   * Payment number.
   * @returns {string}
   */
  public paymentNumber(): string {
    return this.options.paymentReceived.paymentReceiveNumber;
  }

  /**
   * Items.
   * @returns
   */
  public items() {
    return this.item(
      this.options.paymentReceived.entries,
      new GetPaymentReceivedMailTemplateItemAttrsTransformer()
    );
  }
}

class GetPaymentReceivedMailTemplateItemAttrsTransformer extends Transformer {
  /**
   * Included attributes.
   * @returns {Array}
   */
  public includeAttributes = () => {
    return ['label', 'total'];
  };

  /**
   * Excluded attributes.
   * @returns {string[]}
   */
  public excludeAttributes = () => {
    return ['*'];
  };

  /**
   *
   * @param entry
   * @returns
   */
  public label(entry) {
    return entry.invoice.invoiceNo;
  }

  /**
   *
   * @param entry
   * @returns
   */
  public total(entry) {
    return entry.paymentAmountFormatted;
  }
}
