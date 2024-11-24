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
      'paymentNumberLabel',
      'paymentNumber',
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
   * Payment number label.
   * @returns
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
}
