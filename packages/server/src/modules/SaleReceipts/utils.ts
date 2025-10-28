// @ts-nocheck
import {
  ISaleReceipt,
  ISaleReceiptBrandingTemplateAttributes,
} from '@/interfaces';
import { contactAddressTextFormat } from '@/utils/address-text-format';

export const transformReceiptToBrandingTemplateAttributes = (
  saleReceipt: ISaleReceipt
): Partial<ISaleReceiptBrandingTemplateAttributes> => {
  return {
    total: saleReceipt.totalFormatted,
    subtotal: saleReceipt.subtotalFormatted,
    lines: saleReceipt.entries?.map((entry) => ({
      item: entry.item.name,
      description: entry.description,
      rate: entry.rateFormatted,
      quantity: entry.quantityFormatted,
      total: entry.totalFormatted,
    })),
    receiptNumber: saleReceipt.receiptNumber,
    receiptDate: saleReceipt.formattedReceiptDate,
    adjustment: saleReceipt.adjustmentFormatted,
    discount: saleReceipt.discountAmountFormatted,
    discountLabel: saleReceipt.discountPercentageFormatted
      ? `Discount [${saleReceipt.discountPercentageFormatted}]`
      : 'Discount',
    customerAddress: contactAddressTextFormat(saleReceipt.customer),
  };
};

export const transformReceiptToMailDataArgs = (saleReceipt: any) => {
  return {
    'Customer Name': saleReceipt.customer.displayName,
    'Receipt Number': saleReceipt.receiptNumber,
    'Receipt Date': saleReceipt.formattedReceiptDate,
    'Receipt Amount': saleReceipt.formattedAmount,
  };
};
