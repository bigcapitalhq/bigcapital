import {
  IProfitLossSheetAccountNode,
  IProfitLossSheetAccountsNode,
  IProfitLossSheetEquationNode,
  IProfitLossSheetNode,
  IProfitLossSheetPercentage,
  IProfitLossSheetTotal,
  ProfitLossAggregateNodeId,
  ProfitLossNodeType,
} from './ProfitLossSheet.types';
import { sortProfitLossSheetAccountsNodes } from './_utils';

const createTotal = (amount: number): IProfitLossSheetTotal => ({
  amount,
  formattedAmount: `${amount}`,
  currencyCode: 'USD',
});

const createPercentage = (amount: number): IProfitLossSheetPercentage => ({
  amount,
  formattedAmount: `${amount}%`,
});

const createAccountNode = (
  overrides: Partial<IProfitLossSheetAccountNode> = {},
): IProfitLossSheetAccountNode => ({
  id: 1,
  name: 'Account',
  nodeType: ProfitLossNodeType.ACCOUNT,
  total: createTotal(0),
  ...overrides,
});

const createAccountsNode = (
  id: ProfitLossAggregateNodeId,
  children: IProfitLossSheetNode[],
): IProfitLossSheetAccountsNode => ({
  id,
  name: `${id}`,
  nodeType: ProfitLossNodeType.ACCOUNTS,
  total: createTotal(0),
  children,
});

const createEquationNode = (
  id: ProfitLossAggregateNodeId,
  amount = 0,
): IProfitLossSheetEquationNode => ({
  id,
  name: `${id}`,
  nodeType: ProfitLossNodeType.EQUATION,
  total: createTotal(amount),
});

/**
 * Retrieves the account names of the given accounts node children.
 * @param {IProfitLossSheetNode} node
 * @returns {string[]}
 */
const getAccountChildrenNames = (node: IProfitLossSheetNode): string[] =>
  (node.children ?? []).map((child) => child.name);

describe('sortProfitLossSheetAccountsNodes', () => {
  it('keeps the original order when no column is provided', () => {
    const nodes = [
      createAccountsNode(ProfitLossAggregateNodeId.INCOME, [
        createAccountNode({ id: 1, name: 'Beta', total: createTotal(100) }),
        createAccountNode({ id: 2, name: 'Alpha', total: createTotal(300) }),
      ]),
    ];

    expect(sortProfitLossSheetAccountsNodes(nodes)).toEqual(nodes);
  });

  it('sorts account nodes of the same parent by total in descending order', () => {
    const nodes = [
      createAccountsNode(ProfitLossAggregateNodeId.INCOME, [
        createAccountNode({ id: 1, name: 'Beta', total: createTotal(100) }),
        createAccountNode({ id: 2, name: 'Alpha', total: createTotal(300) }),
        createAccountNode({ id: 3, name: 'Gamma', total: createTotal(200) }),
      ]),
    ];

    const sorted = sortProfitLossSheetAccountsNodes(nodes, 'total', 'desc');

    expect(getAccountChildrenNames(sorted[0])).toEqual([
      'Alpha',
      'Gamma',
      'Beta',
    ]);
  });

  it('sorts the accounts of each section independently', () => {
    const nodes = [
      createAccountsNode(ProfitLossAggregateNodeId.INCOME, [
        createAccountNode({ id: 1, name: 'Sales B', total: createTotal(100) }),
        createAccountNode({ id: 2, name: 'Sales A', total: createTotal(300) }),
      ]),
      createEquationNode(ProfitLossAggregateNodeId.GROSS_PROFIT, 400),
      createAccountsNode(ProfitLossAggregateNodeId.EXPENSES, [
        createAccountNode({ id: 3, name: 'Rent', total: createTotal(50) }),
        createAccountNode({ id: 4, name: 'Salaries', total: createTotal(500) }),
      ]),
    ];

    const sorted = sortProfitLossSheetAccountsNodes(nodes, 'total', 'desc');

    expect(sorted.map((node) => node.id)).toEqual([
      ProfitLossAggregateNodeId.INCOME,
      ProfitLossAggregateNodeId.GROSS_PROFIT,
      ProfitLossAggregateNodeId.EXPENSES,
    ]);
    expect(getAccountChildrenNames(sorted[0])).toEqual(['Sales A', 'Sales B']);
    expect(getAccountChildrenNames(sorted[2])).toEqual(['Salaries', 'Rent']);
  });

  it('sorts nested account children', () => {
    const nodes = [
      createAccountsNode(ProfitLossAggregateNodeId.EXPENSES, [
        createAccountNode({
          id: 1,
          name: 'Parent',
          total: createTotal(300),
          children: [
            createAccountNode({
              id: 2,
              name: 'Child B',
              total: createTotal(100),
            }),
            createAccountNode({
              id: 3,
              name: 'Child A',
              total: createTotal(200),
            }),
          ],
        }),
      ]),
    ];

    const sorted = sortProfitLossSheetAccountsNodes(nodes, 'total', 'asc');
    const parentNode = (sorted[0].children ?? [])[0];

    expect((parentNode.children ?? []).map((node) => node.name)).toEqual([
      'Child B',
      'Child A',
    ]);
  });

  it('sorts by the account name using the numeric order', () => {
    const nodes = [
      createAccountsNode(ProfitLossAggregateNodeId.INCOME, [
        createAccountNode({ id: 1, name: 'Account 10' }),
        createAccountNode({ id: 2, name: 'Account 2' }),
        createAccountNode({ id: 3, name: 'Bank' }),
      ]),
    ];

    const sorted = sortProfitLossSheetAccountsNodes(nodes, 'name', 'asc');

    expect(getAccountChildrenNames(sorted[0])).toEqual([
      'Account 2',
      'Account 10',
      'Bank',
    ]);
  });

  it('sorts by the percentage of income', () => {
    const nodes = [
      createAccountsNode(ProfitLossAggregateNodeId.INCOME, [
        createAccountNode({
          id: 1,
          name: 'Beta',
          percentageIncome: createPercentage(10),
        }),
        createAccountNode({
          id: 2,
          name: 'Alpha',
          percentageIncome: createPercentage(30),
        }),
      ]),
    ];

    const sorted = sortProfitLossSheetAccountsNodes(
      nodes,
      'percentage_income',
      'desc',
    );

    expect(getAccountChildrenNames(sorted[0])).toEqual(['Alpha', 'Beta']);
  });

  it('sorts by the percentage of expenses using the singular node property', () => {
    const nodes = [
      createAccountsNode(ProfitLossAggregateNodeId.EXPENSES, [
        createAccountNode({
          id: 1,
          name: 'Rent',
          percentageExpense: createPercentage(15),
        }),
        createAccountNode({
          id: 2,
          name: 'Salaries',
          percentageExpense: createPercentage(45),
        }),
      ]),
    ];

    const sorted = sortProfitLossSheetAccountsNodes(
      nodes,
      'percentage_expenses',
      'desc',
    );

    expect(getAccountChildrenNames(sorted[0])).toEqual(['Salaries', 'Rent']);
  });

  it('sorts by the previous year amount', () => {
    const nodes = [
      createAccountsNode(ProfitLossAggregateNodeId.EXPENSES, [
        createAccountNode({
          id: 1,
          name: 'Rent',
          previousYear: createTotal(100),
        }),
        createAccountNode({
          id: 2,
          name: 'Salaries',
          previousYear: createTotal(300),
        }),
      ]),
    ];

    const sorted = sortProfitLossSheetAccountsNodes(
      nodes,
      'previous_year',
      'desc',
    );

    expect(getAccountChildrenNames(sorted[0])).toEqual(['Salaries', 'Rent']);
  });
});
