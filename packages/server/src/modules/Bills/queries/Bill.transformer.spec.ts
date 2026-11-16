import { BillTransformer } from './Bill.transformer';

describe('BillTransformer', () => {
  it('includes the batches attribute only when the option is enabled', () => {
    const transformer = new BillTransformer();

    transformer.setOptions({ includeBatches: true });
    expect(transformer.includeAttributes()).toContain('batches');

    transformer.setOptions({ includeBatches: false });
    expect(transformer.includeAttributes()).not.toContain('batches');
  });
});
