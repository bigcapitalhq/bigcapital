import { Transformer } from '@/lib/Transformer/Transformer';

export class GetInvoiceMailTemplateAttributesTransformer extends Transformer {
  /**
   * Include these attributes to item entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'companyLogoUri',
      'companyName',

      'invoiceAmount',

      'primaryColor',

      'invoiceAmount',
      'invoiceMessage',

      'dueDate',
      'dueDateLabel',

      'invoiceNumber',
      'invoiceNumberLabel',

      'subtotal',
      'subtotalLabel',

      'discount',
      'discountLabel',

      'adjustment',
      'adjustmentLabel',

      'total',
      'totalLabel',

      'dueAmount',
      'dueAmountLabel',

      'viewInvoiceButtonLabel',
      'viewInvoiceButtonUrl',

      'items',
    ];
  };

  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public companyLogoUri(): string {
    return this.options.brandingTemplate?.companyLogoUri;
  }

  public companyName(): string {
    return this.context.organization.name;
  }

  public invoiceAmount(): string {
    return this.options.invoice.totalFormatted;
  }

  public primaryColor(): string {
    return this.options?.brandingTemplate?.attributes?.primaryColor;
  }

  public invoiceMessage(): string {
    return '';
  }

  public dueDate(): string {
    return this.options?.invoice?.dueDateFormatted;
  }

  public dueDateLabel(): string {
    return 'Due {dueDate}';
  }

  public invoiceNumber(): string {
    return this.options?.invoice?.invoiceNo;
  }

  public invoiceNumberLabel(): string {
    return 'Invoice # {invoiceNumber}';
  }

  public subtotal(): string {
    return this.options.invoice?.subtotalFormatted;
  }

  public subtotalLabel(): string {
    return 'Subtotal';
  }

  public discount(): string {
    return this.options.invoice?.discountAmountFormatted;
  }

  public discountLabel(): string {
    return 'Discount';
  }

  public adjustment(): string {
    return this.options.invoice?.adjustmentFormatted;
  }

  public adjustmentLabel(): string {
    return 'Adjustment';
  }

  public total(): string {
    return this.options.invoice?.totalFormatted;
  }

  public totalLabel(): string {
    return 'Total';
  }

  public dueAmount(): string {
    return this.options?.invoice.dueAmountFormatted;
  }

  public dueAmountLabel(): string {
    return 'Due Amount';
  }

  public viewInvoiceButtonLabel(): string {
    return 'View Invoice';
  }

  public viewInvoiceButtonUrl(): string {
    return '';
  }

  public items(): Array<any> {
    return this.item(
      this.options.invoice?.entries,
      new GetInvoiceMailTemplateItemAttrsTransformer()
    );
  }
}

class GetInvoiceMailTemplateItemAttrsTransformer extends Transformer {
  /**
   * Include these attributes to item entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['quantity', 'label', 'rate'];
  };

  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public quantity(entry): string {
    return entry?.quantity;
  }

  public label(entry): string {
    console.log(entry);
    return entry?.item?.name;
  }

  public rate(entry): string {
    return entry?.rateFormatted;
  }
}
