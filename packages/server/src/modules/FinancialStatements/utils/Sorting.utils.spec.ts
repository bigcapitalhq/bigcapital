import {
  compareFinancialReportSortValues,
  sortFinancialReportNodes,
} from './Sorting.utils';

interface TestNode {
  name: string;
  amount: number | null;
}

describe('compareFinancialReportSortValues', () => {
  it('compares strings with numeric support', () => {
    expect(
      compareFinancialReportSortValues('Account 2', 'Account 10'),
    ).toBeLessThan(0);
  });

  it('compares numbers by subtraction', () => {
    expect(compareFinancialReportSortValues(100, 300)).toBe(-200);
    expect(compareFinancialReportSortValues(300, 100)).toBe(200);
  });

  it('treats empty values as zero', () => {
    expect(compareFinancialReportSortValues(null, 0)).toBe(0);
    expect(compareFinancialReportSortValues(undefined, 100)).toBe(-100);
  });
});

describe('sortFinancialReportNodes', () => {
  const getAmount = (node: TestNode) => node.amount;

  it('returns the original nodes when no accessor is provided', () => {
    const nodes: TestNode[] = [
      { name: 'Beta', amount: 100 },
      { name: 'Alpha', amount: 300 },
    ];

    expect(sortFinancialReportNodes(nodes)).toBe(nodes);
  });

  it('sorts nodes in the ascending order by default', () => {
    const nodes: TestNode[] = [
      { name: 'Beta', amount: 100 },
      { name: 'Alpha', amount: 300 },
      { name: 'Gamma', amount: 200 },
    ];

    expect(
      sortFinancialReportNodes(nodes, getAmount).map((node) => node.name),
    ).toEqual(['Beta', 'Gamma', 'Alpha']);
  });

  it('sorts nodes in the descending order when sort order is desc', () => {
    const nodes: TestNode[] = [
      { name: 'Beta', amount: 100 },
      { name: 'Alpha', amount: 300 },
      { name: 'Gamma', amount: 200 },
    ];

    expect(
      sortFinancialReportNodes(nodes, getAmount, 'desc').map(
        (node) => node.name,
      ),
    ).toEqual(['Alpha', 'Gamma', 'Beta']);
  });

  it('does not mutate the original nodes', () => {
    const nodes: TestNode[] = [
      { name: 'Beta', amount: 100 },
      { name: 'Alpha', amount: 300 },
    ];
    const sorted = sortFinancialReportNodes(nodes, getAmount);

    expect(sorted).not.toBe(nodes);
    expect(nodes.map((node) => node.name)).toEqual(['Beta', 'Alpha']);
  });
});
