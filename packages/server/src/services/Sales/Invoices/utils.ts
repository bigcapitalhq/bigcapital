import { pickBy } from 'lodash';
import { ISaleInvoice } from '@/interfaces';
import { contactAddressTextFormat } from '@/utils/address-text-format';
import { InvoicePaperTemplateProps } from '@bigcapital/pdf-templates';

export const mergePdfTemplateWithDefaultAttributes = (
  brandingTemplate?: Record<string, any>,
  defaultAttributes: Record<string, any> = {}
) => {
  const brandingAttributes = pickBy(
    brandingTemplate,
    (val, key) => val !== null && Object.keys(defaultAttributes).includes(key)
  );
  return {
    ...defaultAttributes,
    ...brandingAttributes,
  };
};

export const transformInvoiceToPdfTemplate = (
  invoice: ISaleInvoice
): Partial<InvoicePaperTemplateProps> => {
  return {
    dueDate: invoice.dueDateFormatted,
    dateIssue: invoice.invoiceDateFormatted,
    invoiceNumber: invoice.invoiceNo,

    total: invoice.totalFormatted,
    subtotal: invoice.subtotalFormatted,
    paymentMade: invoice.paymentAmountFormatted,
    dueAmount: invoice.dueAmountFormatted,
    discount: invoice.discountAmountFormatted,
    adjustment: invoice.adjustmentFormatted,
    discountLabel: invoice.discountPercentageFormatted
      ? `Discount [${invoice.discountPercentageFormatted}]`
      : 'Discount',

    termsConditions: invoice.termsConditions,
    statement: invoice.invoiceMessage,

    lines: invoice.entries.map((entry) => ({
      item: entry.item.name,
      description: entry.description,
      rate: entry.rateFormatted,
      quantity: entry.quantityFormatted,
      discount: entry.discountFormatted,
      total: entry.totalFormatted,
    })),
    taxes: invoice.taxes.map((tax) => ({
      label: tax.name,
      amount: tax.taxRateAmountFormatted,
    })),
    showLineDiscount: invoice.entries.some((entry) => entry.discountFormatted),
    customerAddress: contactAddressTextFormat(invoice.customer),
  };
};
