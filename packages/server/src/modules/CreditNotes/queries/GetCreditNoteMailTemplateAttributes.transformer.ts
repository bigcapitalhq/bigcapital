import { Transformer } from '@/modules/Transformer/Transformer';

export class GetCreditNoteMailTemplateAttributesTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return [
      'companyLogoUri',
      'companyName',

      'creditNoteNumber',
      'creditNoteNumberLabel',

      'primaryColor',

      'preview',

      'total',
      'totalLabel',

      'subtotal',
      'subtotalLabel',

      'discount',
      'discountLabel',

      'adjustment',
      'adjustmentLabel',

      'viewButtonLabel',
      'viewButtonUrl',

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
    return (
      this.options.brandingTemplate?.companyLogoUri ||
      this.options.brandingTemplate?.attributes?.companyLogoUri ||
      null
    );
  }

  /**
   * Company name.
   * @returns {string}
   */
  public companyName(): string {
    return this.context.organization.name;
  }

  /**
   * Primary color.
   * @returns {string}
   */
  public primaryColor(): string {
    return this.options.brandingTemplate?.attributes?.primaryColor || null;
  }

  /**
   * Credit note number.
   * @returns {string}
   */
  public creditNoteNumber(): string {
    return this.options.creditNote.creditNoteNumber;
  }

  /**
   * Credit note number label.
   * @returns {string}
   */
  public creditNoteNumberLabel(): string {
    return this.context.i18n.t('credit_note.mail.credit_note_number', {
      args: { creditNoteNumber: this.creditNoteNumber() },
    });
  }

  /**
   * The mail preview text.
   * @returns {string}
   */
  public preview(): string {
    return this.context.i18n.t('credit_note.mail.preview', {
      args: {
        creditNoteNumber: this.options.creditNote.creditNoteNumber,
        organizationName: this.context.organization.name,
      },
    });
  }

  /**
   * Credit note total.
   * @returns {string}
   */
  public total(): string {
    return this.options.creditNote.totalFormatted;
  }

  /**
   * Credit note total label.
   * @returns {string}
   */
  public totalLabel(): string {
    return this.context.i18n.t('credit_note.mail.total');
  }

  /**
   * Credit note discount.
   * @returns {string}
   */
  public discount(): string {
    return this.options.creditNote?.discountAmountFormatted;
  }

  /**
   * Credit note discount label.
   * @returns {string}
   */
  public discountLabel(): string {
    return this.context.i18n.t('credit_note.mail.discount');
  }

  /**
   * Credit note adjustment.
   * @returns {string}
   */
  public adjustment(): string {
    return this.options.creditNote?.adjustmentFormatted;
  }

  /**
   * Credit note adjustment label.
   * @returns {string}
   */
  public adjustmentLabel(): string {
    return this.context.i18n.t('credit_note.mail.adjustment');
  }

  /**
   * Credit note subtotal.
   * @returns {string}
   */
  public subtotal(): string {
    return this.options.creditNote.formattedSubtotal;
  }

  /**
   * Credit note subtotal label.
   * @returns {string}
   */
  public subtotalLabel(): string {
    return this.context.i18n.t('credit_note.mail.subtotal');
  }

  /**
   * The view credit note button label.
   * @returns {string}
   */
  public viewButtonLabel(): string {
    return this.context.i18n.t('credit_note.mail.view_credit_note');
  }

  /**
   * The credit note mail items attributes.
   * @returns {Array}
   */
  public items(): any[] {
    return this.item(
      this.options.creditNote.entries,
      new GetCreditNoteMailTemplateEntryAttributesTransformer(),
    );
  }
}

class GetCreditNoteMailTemplateEntryAttributesTransformer extends Transformer {
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
