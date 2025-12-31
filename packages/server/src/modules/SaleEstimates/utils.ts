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
    total: estimate.totalFormatted,
    subtotal: estimate.formattedSubtotal,
    taxes: estimate.taxes?.map((tax) => ({
      label: `${tax.name} [${tax.taxRate}%]`,
      amount: tax.taxRateAmountFormatted,
    })) || [],
    discount: estimate.discountAmountFormatted,
    discountLabel: estimate.discountPercentageFormatted
      ? `Discount [${estimate.discountPercentageFormatted}]`
      : 'Discount',
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
