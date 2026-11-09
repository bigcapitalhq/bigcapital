import { GetSaleInvoiceMailStateTransformer } from '../SaleInvoices/queries/GetSaleInvoiceMailState.transformer';
import { GetSaleEstimateMailStateTransformer } from '../SaleEstimates/queries/GetSaleEstimateMailState.transformer';
import { GetCreditNoteMailStateTransformer } from '../CreditNotes/queries/GetCreditNoteMailState.transformer';
import { GetSaleReceiptMailStateTransformer } from '../SaleReceipts/queries/GetSaleReceiptMailState.transformer';

const translations: Record<string, string> = {
  'invoice.mail.discount': 'Discount',
  'invoice.mail.discount_with_percentage': 'Discount [{percentage}]',
  'estimate.mail.discount': 'Discount',
  'estimate.mail.discount_with_percentage': 'Discount [{percentage}]',
  'credit_note.mail.discount': 'Discount',
  'credit_note.mail.discount_with_percentage': 'Discount [{percentage}]',
  'receipt.mail.discount': 'Discount',
  'receipt.mail.discount_with_percentage': 'Discount [{percentage}]',
};

const i18nMock = {
  t: (key: string, options?: { args?: Record<string, any> }) => {
    const template = translations[key] ?? key;

    return template.replace(
      /\{(\w+)\}/g,
      (_, name) => options?.args?.[name] ?? '',
    );
  },
};

const transformDiscountLabel = (transformer, model) => {
  transformer.includeAttributes = () => ['discountLabel'];
  transformer.options = {};
  transformer.setContext({ i18n: i18nMock });

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
