import { SaleInvoiceTransformer } from './SaleInvoice.transformer';

describe('SaleInvoiceTransformer', () => {
  it('includes the batches attribute only when the option is enabled', () => {
    const transformer = new SaleInvoiceTransformer();

    transformer.setOptions({ includeBatches: true });
    expect(transformer.includeAttributes()).toContain('batches');

    transformer.setOptions({ includeBatches: false });
    expect(transformer.includeAttributes()).not.toContain('batches');
  });
});
