import {
  compareFinancialReportSortValues,
  sortFinancialReportNodes,
  sortFinancialReportNodesTree,
} from './Sorting.utils';

interface TestNode {
  name: string;
  amount: number | null;
  group?: boolean;
  children?: TestNode[];
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

describe('sortFinancialReportNodesTree', () => {
  const getAmount = (node: TestNode) => node.amount;
  const isAccountNode = (node: TestNode) => !node.group;

  it('returns the original nodes when no accessor is provided', () => {
    const nodes: TestNode[] = [
      {
        name: 'Income',
        amount: 0,
        group: true,
        children: [
          { name: 'Beta', amount: 100 },
          { name: 'Alpha', amount: 300 },
        ],
      },
    ];

    expect(sortFinancialReportNodesTree(nodes, isAccountNode)).toBe(nodes);
  });

  it('sorts the sortable nodes among their siblings', () => {
    const nodes: TestNode[] = [
      {
        name: 'Income',
        amount: 0,
        group: true,
        children: [
          { name: 'Beta', amount: 100 },
          { name: 'Alpha', amount: 300 },
          { name: 'Gamma', amount: 200 },
        ],
      },
    ];

    const sorted = sortFinancialReportNodesTree(
      nodes,
      isAccountNode,
      getAmount,
      'desc',
    );

    expect(sorted[0].children.map((node) => node.name)).toEqual([
      'Alpha',
      'Gamma',
      'Beta',
    ]);
  });

  it('keeps the structural nodes positions untouched', () => {
    const nodes: TestNode[] = [
      { name: 'Sales', amount: 100 },
      { name: 'Gross Profit', amount: 0, group: true },
      { name: 'Rent', amount: 50 },
    ];

    const sorted = sortFinancialReportNodesTree(
      nodes,
      isAccountNode,
      getAmount,
      'desc',
    );

    expect(sorted.map((node) => node.name)).toEqual([
      'Sales',
      'Gross Profit',
      'Rent',
    ]);
  });

  it('sorts the nested children recursively', () => {
    const nodes: TestNode[] = [
      {
        name: 'Expenses',
        amount: 0,
        group: true,
        children: [
          {
            name: 'Parent',
            amount: 300,
            children: [
              { name: 'Child B', amount: 100 },
              { name: 'Child A', amount: 200 },
            ],
          },
        ],
      },
    ];

    const sorted = sortFinancialReportNodesTree(
      nodes,
      isAccountNode,
      getAmount,
    );
    const parentNode = sorted[0].children[0];

    expect(parentNode.children.map((node) => node.name)).toEqual([
      'Child B',
      'Child A',
    ]);
  });
});
