import { InventoryTurnoverByAmount } from './InventoryTurnoverByAmount';
import { InventoryTurnoverByAmountRepository } from './InventoryTurnoverByAmountRepository';
import { IInventoryTurnoverByAmountQuery } from './InventoryTurnoverByAmount.types';

const query: IInventoryTurnoverByAmountQuery = {
  fromDate: '2024-01-01',
  toDate: '2024-01-31',
  itemsIds: [],
  numberFormat: {
    precision: 2,
    divideOn1000: false,
    showZero: false,
    formatMoney: 'always',
    negativeFormat: 'mines',
  },
  branchesIds: [],
  warehousesIds: [],
};

const createReport = ({
  items = [
    { id: 1, name: 'Item A', code: 'A-1' },
    { id: 2, name: 'Item B', code: 'B-1' },
  ],
  openingCostLots = new Map(),
  periodCostLots = new Map(),
  periodSalesCostLots = new Map(),
  closingQuantities = new Map(),
  lastSellDates = new Map(),
}: {
  items?: Array<{ id: number; name: string; code: string }>;
  openingCostLots?: Map<number, { costIn: number; costOut: number }>;
  periodCostLots?: Map<number, { costIn: number; costOut: number }>;
  periodSalesCostLots?: Map<number, { costIn: number; costOut: number }>;
  closingQuantities?: Map<number, number>;
  lastSellDates?: Map<number, Date | string>;
}) => {
  const repository = {
    inventoryItems: items,
    openingCostLotsByItemId: openingCostLots,
    periodCostLotsByItemId: periodCostLots,
    periodSalesCostLotsByItemId: periodSalesCostLots,
    closingQuantitiesByItemId: closingQuantities,
    lastSellDatesByItemId: lastSellDates,
  } as unknown as InventoryTurnoverByAmountRepository;

  return new InventoryTurnoverByAmount(query, repository, {
    baseCurrency: 'USD',
    dateFormat: 'YYYY MMM DD',
  });
};

describe('InventoryTurnoverByAmount', () => {
  it('calculates opening, closing, COGS, average price, ratio and days', () => {
    const report = createReport({
      openingCostLots: new Map([[1, { costIn: 100, costOut: 0 }]]),
      periodCostLots: new Map([[1, { costIn: 50, costOut: 30 }]]),
      periodSalesCostLots: new Map([[1, { costIn: 0, costOut: 30 }]]),
      closingQuantities: new Map([[1, 12]]),
      lastSellDates: new Map([[1, '2024-01-20']]),
    });

    const [item] = report.reportData().items;

    expect(item.openingBalance).toBe(100);
    expect(item.closingBalance).toBe(120);
    expect(item.costOfGoodsSold).toBe(30);
    expect(item.averagePrice).toBe(110);
    expect(item.turnoverRatio).toBeCloseTo(30 / 110);
    expect(item.averageTurnoverDays).toBeCloseTo(31 / (30 / 110));
    expect(item.qtyOnHand).toBe(12);
    expect(item.lastSellDateFormatted).toBe('2024 Jan 20');
  });

  it('nets sales returns against the cost of goods sold', () => {
    const report = createReport({
      openingCostLots: new Map([[1, { costIn: 100, costOut: 0 }]]),
      periodCostLots: new Map([[1, { costIn: 40, costOut: 100 }]]),
      periodSalesCostLots: new Map([[1, { costIn: 20, costOut: 100 }]]),
      closingQuantities: new Map([[1, 40]]),
      lastSellDates: new Map([[1, '2024-01-20']]),
    });

    const [item] = report.reportData().items;

    expect(item.costOfGoodsSold).toBe(80);
    expect(item.closingBalance).toBe(40);
  });

  it('returns zero ratio and days when the average price is zero', () => {
    const report = createReport({
      openingCostLots: new Map([[1, { costIn: 0, costOut: 0 }]]),
      periodCostLots: new Map([[1, { costIn: 0, costOut: 0 }]]),
      periodSalesCostLots: new Map([[1, { costIn: 0, costOut: 0 }]]),
      closingQuantities: new Map([[1, 0]]),
    });

    const reportData = report.reportData();

    expect(reportData.items).toHaveLength(0);
    expect(reportData.total.turnoverRatio).toBe(0);
    expect(reportData.total.averageTurnoverDays).toBe(0);
    expect(reportData.total.turnoverRatioFormatted).not.toContain('NaN');
    expect(reportData.total.averageTurnoverDaysFormatted).not.toContain('NaN');
  });

  it('aggregates total quantities and recomputes the total ratio', () => {
    const report = createReport({
      openingCostLots: new Map([
        [1, { costIn: 100, costOut: 0 }],
        [2, { costIn: 200, costOut: 0 }],
      ]),
      periodCostLots: new Map([
        [1, { costIn: 0, costOut: 50 }],
        [2, { costIn: 0, costOut: 100 }],
      ]),
      periodSalesCostLots: new Map([
        [1, { costIn: 0, costOut: 50 }],
        [2, { costIn: 0, costOut: 100 }],
      ]),
      closingQuantities: new Map([
        [1, 10],
        [2, 20],
      ]),
      lastSellDates: new Map([
        [1, '2024-01-20'],
        [2, '2024-01-25'],
      ]),
    });

    const { items, total } = report.reportData();

    expect(items).toHaveLength(2);
    expect(total.openingBalance).toBe(300);
    expect(total.closingBalance).toBe(150);
    expect(total.costOfGoodsSold).toBe(150);
    expect(total.averagePrice).toBe(225);
    expect(total.turnoverRatio).toBeCloseTo(150 / 225);
    expect(total.qtyOnHand).toBe(30);
    expect(total.lastSellDateFormatted).toBe('');
  });
});
