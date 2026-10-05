import { GetSaleInvoiceMailStateTransformer } from '../SaleInvoices/queries/GetSaleInvoiceMailState.transformer';
import { GetSaleEstimateMailStateTransformer } from '../SaleEstimates/queries/GetSaleEstimateMailState.transformer';
import { GetCreditNoteMailStateTransformer } from '../CreditNotes/queries/GetCreditNoteMailState.transformer';
import { GetSaleReceiptMailStateTransformer } from '../SaleReceipts/queries/GetSaleReceiptMailState.transformer';

const transformDiscountLabel = (transformer, model) => {
  transformer.includeAttributes = () => ['discountLabel'];
  transformer.options = {};

  return transformer.work(model).discountLabel;
};

describe('Mail state discount label', () => {
  const percentageDiscount = {
    discountType: 'percentage',
    discount: 10,
    discountPercentage: 10,
  };
  const amountDiscount = {
    discountType: 'amount',
    discount: 10,
    discountPercentage: null,
  };

  it.each([
    ['invoice', GetSaleInvoiceMailStateTransformer],
    ['estimate', GetSaleEstimateMailStateTransformer],
    ['credit note', GetCreditNoteMailStateTransformer],
    ['receipt', GetSaleReceiptMailStateTransformer],
  ])('shows the discount percentage of the %s', (_, Transformer) => {
    expect(transformDiscountLabel(new Transformer(), percentageDiscount)).toBe(
      'Discount [10%]',
    );
    expect(transformDiscountLabel(new Transformer(), amountDiscount)).toBe(
      'Discount',
    );
  });
});
