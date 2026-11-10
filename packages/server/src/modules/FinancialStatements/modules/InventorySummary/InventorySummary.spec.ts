import { InventorySummaryReport } from './InventorySummary';
import { InventorySummaryRepository } from './InventorySummaryRepository';
import { IInventorySummaryQuery } from './InventorySummary.types';

describe('InventorySummaryReport', () => {
  const createQuery = (
    overrides: Partial<IInventorySummaryQuery> = {},
  ): IInventorySummaryQuery => ({
    fromDate: '2024-01-01',
    toDate: '2024-01-31',
    numberFormat: {
      precision: 2,
      divideOn1000: false,
      showZero: false,
      formatMoney: 'total',
      negativeFormat: 'mines',
    },
    noneTransactions: false,
    itemsIds: [],
    warehousesIds: [],
    branchesIds: [],
    ...overrides,
  });

  const createRepository = () => {
    const repository = new InventorySummaryRepository();

    repository.items = [
      { id: 1, name: 'Item A', code: 'A-001' },
      { id: 2, name: 'Item B', code: 'B-001' },
      { id: 3, name: 'Item C', code: 'C-001' },
    ] as any;
    repository.openingStockByItemId = new Map([[1, 10]]);
    repository.periodTotalsByItemId = new Map([
      [1, { quantityIn: 5, quantityOut: 3 }],
    ]);
    return repository;
  };

  const createReport = (
    query: IInventorySummaryQuery,
    repository: InventorySummaryRepository,
  ) =>
    new InventorySummaryReport(query, repository, {
      baseCurrency: 'USD',
      dateFormat: 'YYYY MMM DD',
    });

  it('computes opening, in/out, and closing quantities per item', () => {
    const report = createReport(createQuery(), createRepository());
    const { items } = report.reportData();

    expect(items).toHaveLength(3);

    expect(items[0]).toMatchObject({
      id: 1,
      openingStock: 10,
      quantityIn: 5,
      quantityOut: 3,
      closingStock: 12,
    });
    expect(items[1]).toMatchObject({
      id: 2,
      openingStock: 0,
      quantityIn: 0,
      quantityOut: 0,
      closingStock: 0,
    });
  });

  it('computes the totals across all items', () => {
    const report = createReport(createQuery(), createRepository());
    const { total } = report.reportData();

    expect(total).toMatchObject({
      openingStock: 10,
      quantityIn: 5,
      quantityOut: 3,
      closingStock: 12,
    });
  });

  it('excludes items without transactions when noneTransactions is true', () => {
    const report = createReport(
      createQuery({ noneTransactions: true }),
      createRepository(),
    );
    const { items, total } = report.reportData();

    expect(items.map((item) => item.id)).toEqual([1]);
    expect(total).toMatchObject({
      openingStock: 10,
      quantityIn: 5,
      quantityOut: 3,
      closingStock: 12,
    });
  });
});
