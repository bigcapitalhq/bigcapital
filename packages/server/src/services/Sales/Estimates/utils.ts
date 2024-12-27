import { EstimatePaperTemplateProps } from '@bigcapital/pdf-templates';
import { contactAddressTextFormat } from '@/utils/address-text-format';

export const transformEstimateToPdfTemplate = (
  estimate
): Partial<EstimatePaperTemplateProps> => {
  return {
    expirationDate: estimate.formattedExpirationDate,
    estimateNumebr: estimate.estimateNumber,
    estimateDate: estimate.formattedEstimateDate,
    lines: estimate.entries.map((entry) => ({
      item: entry.item.name,
      description: entry.description,
      rate: entry.rateFormatted,
      quantity: entry.quantityFormatted,
      discount: entry.discountFormatted,
      total: entry.totalFormatted,
    })),
    total: estimate.totalFormatted,
    subtotal: estimate.formattedSubtotal,
    adjustment: estimate.adjustmentFormatted,
    customerNote: estimate.note,
    termsConditions: estimate.termsConditions,
    customerAddress: contactAddressTextFormat(estimate.customer),
    showLineDiscount: estimate.entries.some((entry) => entry.discountFormatted),
    discount: estimate.discountAmountFormatted,
    discountLabel: estimate.discountPercentageFormatted
      ? `Discount [${estimate.discountPercentageFormatted}]`
      : 'Discount',
  };
};

export const transformEstimateToMailDataArgs = (estimate: any) => {
  return {
    'Customer Name': estimate.customer.displayName,
    'Estimate Number': estimate.estimateNumber,
    'Estimate Date': estimate.formattedEstimateDate,
    'Estimate Amount': estimate.formattedAmount,
    'Estimate Expiration Date': estimate.formattedExpirationDate,
  };
};
