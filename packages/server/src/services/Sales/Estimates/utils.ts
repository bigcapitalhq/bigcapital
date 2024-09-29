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
    customerNote: estimate.customerNote,
    termsConditions: estimate.termsConditions,
    customerAddress: contactAddressTextFormat(estimate.customer),
  };
};
