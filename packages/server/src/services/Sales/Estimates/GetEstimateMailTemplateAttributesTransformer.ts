import { Transformer } from '@/lib/Transformer/Transformer';

export class GetEstimateMailTemplateAttributesTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return [
      'companyLogoUri',
      'companyName',

      'estimateAmount',

      'primaryColor',

      'estimateAmount',
      'estimateMessage',

      'dueDate',
      'dueDateLabel',

      'estimateNumber',
      'estimateNumberLabel',

      'total',
      'totalLabel',

      'dueAmount',
      'dueAmountLabel',

      'viewEstimateButtonLabel',
      'viewEstimateButtonUrl',

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
   * Estimate number.
   * @returns {string}
   */
  public estimateNumber(): string {
    return this.options.estimate.number;
  }

  /**
   * Estimate number label.
   * @returns {string}
   */
  public estimateNumberLabel(): string {
    return 'Estimate Number';
  }

  /**
   * Expiration date.
   * @returns {string}
   */
  public expirationDate(): string {
    return this.options.estimate.expirationDate;
  }

  /**
   * Expiration date label.
   * @returns {string}
   */
  public expirationDateLabel(): string {
    return 'Expiration Date';
  }

  /**
   * Estimate total.
   */
  public total(): string {
    return this.options.estimate.totalFormatted;
  }

  /**
   * Estimate total label.
   * @returns {string}
   */
  public totalLabel(): string {
    return 'Total';
  }

  /**
   * Estimate mail items attributes.
   */
  public items(): any[] {
    return this.item(
      this.options.estimate.entries,
      new GetEstimateMailTemplateEntryAttributesTransformer()
    );
  }
}

class GetEstimateMailTemplateEntryAttributesTransformer extends Transformer {
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
