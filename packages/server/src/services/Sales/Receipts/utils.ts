import { ISaleReceipt, ISaleReceiptBrandingTemplateAttributes } from "@/interfaces";



export const transformReceiptToBrandingTemplateAttributes = (saleReceipt: ISaleReceipt): Partial<ISaleReceiptBrandingTemplateAttributes> => {
  return {
    total: saleReceipt.formattedAmount,
    subtotal: saleReceipt.formattedSubtotal,
    lines: saleReceipt.entries?.map((entry) => ({
      item: entry.item.name,
      description: entry.description,
      rate: entry.rateFormatted,
      quantity: entry.quantityFormatted,
      total: entry.totalFormatted,
    })),

    receiptNumber: saleReceipt.receiptNumber,
    receiptDate: saleReceipt.formattedReceiptDate,
  };
}