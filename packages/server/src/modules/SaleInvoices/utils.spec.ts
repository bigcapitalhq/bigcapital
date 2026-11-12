import { mergePdfTemplateWithDefaultAttributes } from './utils';
import { defaultInvoicePdfTemplateAttributes } from './constants';
import { defaultCreditNoteBrandingAttributes } from '../CreditNotes/constants';
import { defaultEstimatePdfBrandingAttributes } from '../SaleEstimates/constants';
import { defaultSaleReceiptBrandingAttributes } from '../SaleReceipts/constants';
import { defaultPaymentReceivedPdfTemplateAttributes } from '../PaymentReceived/constants';

describe('mergePdfTemplateWithDefaultAttributes: company tax number', () => {
  it.each([
    ['invoice', defaultInvoicePdfTemplateAttributes],
    ['credit note', defaultCreditNoteBrandingAttributes],
    ['estimate', defaultEstimatePdfBrandingAttributes],
    ['receipt', defaultSaleReceiptBrandingAttributes],
    ['payment received', defaultPaymentReceivedPdfTemplateAttributes],
  ])(
    'turns the tax number on for %s templates saved before A6',
    (_name, defaults) => {
      const attributes = mergePdfTemplateWithDefaultAttributes(
        { showCompanyAddress: true },
        defaults,
      );

      expect(attributes.showCompanyTaxNumber).toBe(true);
    },
  );

  it('keeps a stored false', () => {
    const attributes = mergePdfTemplateWithDefaultAttributes(
      { showCompanyTaxNumber: false },
      defaultInvoicePdfTemplateAttributes,
    );

    expect(attributes.showCompanyTaxNumber).toBe(false);
  });
});
