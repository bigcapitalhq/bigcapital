import { PurchasesByItems } from './PurchasesByItems';
import { IPurchasesByItemsReportQuery } from './types/PurchasesByItems.types';
import { Item } from '@/modules/Items/models/Item';

const query: IPurchasesByItemsReportQuery = {
  fromDate: '2026-01-01',
  toDate: '2026-08-25',
  itemsIds: [],
  numberFormat: {
    precision: 2,
    divideOn1000: false,
    showZero: false,
    formatMoney: 'always',
    negativeFormat: 'mines',
  },
  noneTransactions: true,
  onlyActive: false,
};

describe('PurchasesByItems', () => {
  const items = [
    { id: 1, name: 'Item A', code: 'A' },
    { id: 2, name: 'Item B', code: 'B' },
    { id: 3, name: 'Item C', code: 'C' },
  ] as Item[];

  const itemsTransactions: any[] = [
    { itemId: 1, rate: 100, quantity: 5, cost: 500 },
    { itemId: 2, rate: 50, quantity: 2, cost: 100 },
  ];

  const report = () =>
    new PurchasesByItems(query, items, itemsTransactions, {
      baseCurrency: 'USD',
      dateFormat: 'YYYY MMM DD',
    }).reportData();

  it('aggregates quantity and purchase cost per item', () => {
    const { items: data } = report();

    const itemA = data.find((item) => item.id === 1);
    expect(itemA.quantityPurchased).toBe(5);
    expect(itemA.purchaseCost).toBe(500);
    expect(itemA.averageCostPrice).toBe(100);
  });

  it('computes average cost price', () => {
    const { items: data } = report();

    const itemB = data.find((item) => item.id === 2);
    expect(itemB.quantityPurchased).toBe(2);
    expect(itemB.purchaseCost).toBe(100);
    expect(itemB.averageCostPrice).toBe(50);
  });

  it('filters out items without transactions', () => {
    const { items: data } = report();

    expect(data.find((item) => item.id === 3)).toBeUndefined();
  });

  it('computes the total section', () => {
    const { total } = report();

    expect(total.quantityPurchased).toBe(7);
    expect(total.purchaseCost).toBe(600);
  });
});
