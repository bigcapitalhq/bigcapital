import { transformEntriesToDocumentBatches } from './utils';

describe('transformEntriesToDocumentBatches', () => {
  it('maps the entry batch allocations to document batches', () => {
    const batches = transformEntriesToDocumentBatches(
      [
        {
          itemId: 10,
          item: { name: 'Item A' },
          batches: [
            {
              batchId: 1,
              quantity: 2,
              batch: {
                batchNumber: 'BATCH-001',
                batchRef: 'REF-001',
                expiryDate: '2027-01-01',
              },
            },
            {
              batchId: 2,
              quantity: 3,
              batch: {
                batchNumber: 'BATCH-002',
                batchRef: null,
                expiryDate: null,
              },
            },
          ],
        },
      ],
      'out',
    );

    expect(batches).toEqual([
      {
        batchId: 1,
        batchNumber: 'BATCH-001',
        batchRef: 'REF-001',
        expiryDate: '2027-01-01',
        quantity: 2,
        itemId: 10,
        itemName: 'Item A',
        direction: 'out',
      },
      {
        batchId: 2,
        batchNumber: 'BATCH-002',
        batchRef: null,
        expiryDate: null,
        quantity: 3,
        itemId: 10,
        itemName: 'Item A',
        direction: 'out',
      },
    ]);
  });

  it('falls back to the legacy entry batch reference', () => {
    const batches = transformEntriesToDocumentBatches(
      [
        {
          itemId: 10,
          item: { name: 'Item A' },
          quantity: 4,
          batchId: 3,
          batch: {
            batchNumber: 'BATCH-003',
            batchRef: 'REF-003',
            expiryDate: '2027-03-01',
          },
        },
      ],
      'in',
    );

    expect(batches).toEqual([
      {
        batchId: 3,
        batchNumber: 'BATCH-003',
        batchRef: 'REF-003',
        expiryDate: '2027-03-01',
        quantity: 4,
        itemId: 10,
        itemName: 'Item A',
        direction: 'in',
      },
    ]);
  });

  it('uses placeholders when the item and batch details are missing', () => {
    const batches = transformEntriesToDocumentBatches(
      [
        {
          itemId: 10,
          batchId: 4,
          quantity: 1,
        },
      ],
      'out',
    );

    expect(batches).toEqual([
      {
        batchId: 4,
        batchNumber: '#4',
        batchRef: null,
        expiryDate: null,
        quantity: 1,
        itemId: 10,
        itemName: '-',
        direction: 'out',
      },
    ]);
  });

  it('returns an empty array when the entries have no batch allocations', () => {
    const batches = transformEntriesToDocumentBatches(
      [{ itemId: 10, item: { name: 'Item A' }, quantity: 5 }],
      'out',
    );

    expect(batches).toEqual([]);
  });
});
