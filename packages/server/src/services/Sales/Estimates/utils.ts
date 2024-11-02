import { contactAddressTextFormat } from '@/utils/address-text-format';
import { EstimatePdfBrandingAttributes } from './constants';

export const transformEstimateToPdfTemplate = (
  estimate
): Partial<EstimatePdfBrandingAttributes> => {
  return {
    expirationDate: estimate.formattedExpirationDate,
    estimateNumebr: estimate.estimateNumber,
    estimateDate: estimate.formattedEstimateDate,
    lines: estimate.entries.map((entry) => ({
      item: entry.item.name,
      description: entry.description,
      rate: entry.rateFormatted,
      quantity: entry.quantityFormatted,
      total: entry.totalFormatted,
    })),
    total: estimate.formattedSubtotal,
    subtotal: estimate.formattedSubtotal,
    customerNote: estimate.note,
    termsConditions: estimate.termsConditions,
    customerAddress: contactAddressTextFormat(estimate.customer),
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
