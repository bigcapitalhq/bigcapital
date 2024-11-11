import { Transform } from 'form-data';
import { ItemEntryTransformer } from './ItemEntryTransformer';
import { SaleInvoiceTaxEntryTransformer } from './SaleInvoiceTaxEntryTransformer';
import { SaleInvoiceTransformer } from './SaleInvoiceTransformer';
import { Transformer } from '@/lib/Transformer/Transformer';
import { contactAddressTextFormat } from '@/utils/address-text-format';
import { GetPdfTemplateTransformer } from '@/services/PdfTemplate/GetPdfTemplateTransformer';

export class GetInvoicePaymentLinkMetaTransformer extends SaleInvoiceTransformer {
  /**
   * Exclude these attributes from payment link object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Included attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'customerName',
      'dueAmount',
      'dueDateFormatted',
      'invoiceDateFormatted',
      'total',
      'totalFormatted',
      'totalLocalFormatted',
      'subtotal',
      'subtotalFormatted',
      'subtotalLocalFormatted',
      'dueAmount',
      'dueAmountFormatted',
      'paymentAmount',
      'paymentAmountFormatted',
      'dueDate',
      'dueDateFormatted',
      'invoiceNo',
      'invoiceMessage',
      'termsConditions',
      'entries',
      'taxes',
      'organization',
      'isReceivable',
      'hasStripePaymentMethod',
      'formattedCustomerAddress',
      'brandingTemplate',
    ];
  };

  public customerName(invoice) {
    return invoice.customer.displayName;
  }

  /**
   * Retrieves the organization metadata for the payment link.
   * @returns
   */
  public organization(invoice) {
    return this.item(
      this.context.organization,
      new GetPaymentLinkOrganizationMetaTransformer()
    );
  }

  /**
   * Retrieves the branding template for the payment link.
   * @param {} invoice
   * @returns
   */
  public brandingTemplate(invoice) {
    return this.item(
      invoice.pdfTemplate,
      new GetInvoicePaymentLinkBrandingTemplate()
    );
  }

  /**
   * Retrieves the entries of the sale invoice.
   * @param {ISaleInvoice} invoice
   * @returns {}
   */
  protected entries = (invoice) => {
    return this.item(
      invoice.entries,
      new GetInvoicePaymentLinkEntryMetaTransformer(),
      {
        currencyCode: invoice.currencyCode,
      }
    );
  };

  /**
   * Retrieves the sale invoice entries.
   * @returns {}
   */
  protected taxes = (invoice) => {
    return this.item(
      invoice.taxes,
      new GetInvoicePaymentLinkTaxEntryTransformer(),
      {
        subtotal: invoice.subtotal,
        isInclusiveTax: invoice.isInclusiveTax,
        currencyCode: invoice.currencyCode,
      }
    );
  };

  protected isReceivable(invoice) {
    return invoice.dueAmount > 0;
  }

  protected hasStripePaymentMethod(invoice) {
    return invoice.paymentMethods.some(
      (paymentMethod) => paymentMethod.paymentIntegration.service === 'Stripe'
    );
  }

  get customerAddressFormat() {
    return `{ADDRESS_1}
{ADDRESS_2}
{CITY} {STATE} {POSTAL_CODE}
{COUNTRY}
{PHONE}`;
  }

  /**
   * Retrieves the formatted customer address.
   * @param invoice
   * @returns {string}
   */
  protected formattedCustomerAddress(invoice) {
    return contactAddressTextFormat(
      invoice.customer,
      this.customerAddressFormat
    );
  }
}

class GetPaymentLinkOrganizationMetaTransformer extends Transformer {
  /**
   * Include these attributes to item entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'primaryColor',
      'name',
      'address',
      'logoUri',
      'addressTextFormatted',
    ];
  };

  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Retrieves the formatted text of organization address.
   * @returns {string}
   */
  public addressTextFormatted() {
    return this.context.organization.addressTextFormatted;
  }
}

class GetInvoicePaymentLinkEntryMetaTransformer extends ItemEntryTransformer {
  /**
   * Include these attributes to item entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'quantity',
      'quantityFormatted',
      'rate',
      'rateFormatted',
      'total',
      'totalFormatted',
      'itemName',
      'description',
    ];
  };

  public itemName(entry) {
    return entry.item.name;
  }

  /**
   * Exclude these attributes from payment link object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };
}

class GetInvoicePaymentLinkTaxEntryTransformer extends SaleInvoiceTaxEntryTransformer {
  /**
   * Included attributes.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['name', 'taxRateCode', 'taxRateAmount', 'taxRateAmountFormatted'];
  };
}

class GetInvoicePaymentLinkBrandingTemplate extends GetPdfTemplateTransformer {
  public includeAttributes = (): string[] => {
    return ['companyLogoUri', 'primaryColor'];
  };

  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  primaryColor = (template) => {
    return template.attributes?.primaryColor;
  };
}
