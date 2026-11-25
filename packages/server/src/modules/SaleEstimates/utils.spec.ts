import { transformEstimateToPdfTemplate } from './utils';

// The fields of a transformed estimate that the PDF template reads, for one line of
// 1 x 25.00 with a 25% discount, as in issue #1735.
const transformedEstimate = (overrides = {}) => ({
  formattedExpirationDate: '2026 Dec 23',
  estimateNumber: 'EST-00001',
  formattedEstimateDate: '2026 Nov 23',
  entries: [
    {
      item: { name: 'Item A' },
      description: '',
      rateFormatted: '$25.00',
      quantityFormatted: '1',
      totalFormatted: '$25.00',
    },
  ],
  formattedAmount: '$25.00',
  formattedSubtotal: '25.00',
  discountAmountFormatted: '$6.25',
  discountPercentageFormatted: '25%',
  adjustmentFormatted: '',
  totalFormatted: '$18.75',
  note: '',
  termsConditions: '',
  customer: { displayName: 'Customer A' },
  ...overrides,
});

describe('transformEstimateToPdfTemplate', () => {
  it('prints the total after the discount, not the subtotal', () => {
    const attributes = transformEstimateToPdfTemplate(transformedEstimate());

    expect(attributes.subtotal).toEqual('25.00');
    expect(attributes.total).toEqual('$18.75');
  });

  it('passes the discount amount with its percentage in the label', () => {
    const attributes = transformEstimateToPdfTemplate(transformedEstimate());

    expect(attributes.discount).toEqual('$6.25');
    expect(attributes.discountLabel).toEqual('Discount [25%]');
  });

  it('labels a fixed amount discount without a percentage', () => {
    const attributes = transformEstimateToPdfTemplate(
      transformedEstimate({ discountPercentageFormatted: '' }),
    );

    expect(attributes.discountLabel).toEqual('Discount');
  });

  it('passes the adjustment', () => {
    const attributes = transformEstimateToPdfTemplate(
      transformedEstimate({ adjustmentFormatted: '$2.00' }),
    );

    expect(attributes.adjustment).toEqual('$2.00');
  });
});
