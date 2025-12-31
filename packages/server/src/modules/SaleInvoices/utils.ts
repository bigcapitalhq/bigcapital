// @ts-nocheck
import { pickBy } from 'lodash';
import { InvoicePdfTemplateAttributes, ISaleInvoice } from '@/interfaces';
import { contactAddressTextFormat } from '@/utils/address-text-format';

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
): Partial<InvoicePdfTemplateAttributes> => {
  return {
    dueDate: invoice.dueDateFormatted,
    dateIssue: invoice.invoiceDateFormatted,
    invoiceNumber: invoice.invoiceNo,

    total: invoice.totalFormatted,
    subtotal: invoice.subtotalFormatted,
    paymentMade: invoice.paymentAmountFormatted,
    dueAmount: invoice.dueAmountFormatted,

    termsConditions: invoice.termsConditions,
    statement: invoice.invoiceMessage,

    lines: invoice.entries.map((entry) => ({
      item: entry.item.name,
      description: entry.description,
      rate: entry.rateFormatted,
      quantity: entry.quantityFormatted,
      total: entry.totalFormatted,
    })),
    taxes: invoice.taxes.map((tax) => ({
      label: `${tax.name} [${tax.taxRate}%]`,
      amount: tax.taxRateAmountFormatted,
    })),
    discount: invoice.discountAmountFormatted,
    discountLabel: invoice.discountPercentageFormatted
      ? `Discount [${invoice.discountPercentageFormatted}]`
      : 'Discount',
    customerAddress: contactAddressTextFormat(invoice.customer),
  };
};
