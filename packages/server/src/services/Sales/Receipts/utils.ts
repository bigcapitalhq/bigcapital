import { contactAddressTextFormat } from '@/utils/address-text-format';
import { ReceiptPaperTemplateProps } from '@bigcapital/pdf-templates';

export const transformReceiptToBrandingTemplateAttributes = (
  saleReceipt
): Partial<ReceiptPaperTemplateProps> => {
  return {
    total: saleReceipt.totalFormatted,
    subtotal: saleReceipt.subtotalFormatted,
    lines: saleReceipt.entries?.map((entry) => ({
      item: entry.item.name,
      description: entry.description,
      rate: entry.rateFormatted,
      quantity: entry.quantityFormatted,
      discount: entry.discountFormatted,
      total: entry.totalFormatted,
    })),
    receiptNumber: saleReceipt.receiptNumber,
    receiptDate: saleReceipt.formattedReceiptDate,
    discount: saleReceipt.discountAmountFormatted,
    discountLabel: saleReceipt.discountPercentageFormatted
      ? `Discount [${saleReceipt.discountPercentageFormatted}]`
      : 'Discount',
    showLineDiscount: saleReceipt.entries.some(
      (entry) => entry.discountFormatted
    ),
    adjustment: saleReceipt.adjustmentFormatted,
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
