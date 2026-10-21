import {
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetAggregateNode,
  IBalanceSheetAccountNode,
  IBalanceSheetAccountsNode,
  IBalanceSheetDataNode,
  IBalanceSheetNetIncomeNode,
  IBalanceSheetTotal,
} from './BalanceSheet.types';
import { sortBalanceSheetAccountsNodes } from './_utils';

const createTotal = (amount: number): IBalanceSheetTotal => ({
  amount,
  formattedAmount: `${amount}`,
  currencyCode: 'USD',
});

const createAccountNode = (
  overrides: Partial<IBalanceSheetAccountNode> = {},
): IBalanceSheetAccountNode => ({
  id: 1,
  index: 1,
  name: 'Account',
  code: '1000',
  nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNT,
  total: createTotal(0),
  ...overrides,
});

const createAccountsNode = (
  children: IBalanceSheetDataNode[],
  overrides: Partial<IBalanceSheetAccountsNode> = {},
): IBalanceSheetAccountsNode => ({
  id: 'CASH_EQUIVALENTS',
  name: 'Cash and cash equivalents',
  nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
  total: createTotal(0),
  // The accounts node children type only declares account nodes, while the
  // report also nests structural nodes (e.g. net income) into it.
  children: children as IBalanceSheetAccountNode[],
  ...overrides,
});

const createAggregateNode = (
  children: IBalanceSheetDataNode[],
  overrides: Partial<IBalanceSheetAggregateNode> = {},
): IBalanceSheetAggregateNode => ({
  id: 'ASSETS',
  name: 'Assets',
  nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE,
  total: createTotal(0),
  children,
  ...overrides,
});

const createNetIncomeNode = (
  overrides: Partial<IBalanceSheetNetIncomeNode> = {},
): IBalanceSheetNetIncomeNode => ({
  id: 1,
  name: 'Net Income',
  nodeType: BALANCE_SHEET_SCHEMA_NODE_TYPE.NET_INCOME,
  total: createTotal(0),
  ...overrides,
});

/**
 * Retrieves the children of the given report node.
 * @param {IBalanceSheetDataNode} node
 * @returns {IBalanceSheetDataNode[]}
 */
const getNodeChildren = (
  node: IBalanceSheetDataNode,
): IBalanceSheetDataNode[] => ('children' in node ? (node.children ?? []) : []);

/**
 * Retrieves the account names of the given report nodes children.
 * @param {IBalanceSheetDataNode} node
 * @returns {string[]}
 */
const getAccountChildrenNames = (node: IBalanceSheetDataNode): string[] =>
  getNodeChildren(node)
    .flatMap((child) => getNodeChildren(child))
    .map((child) => child.name);

describe('sortBalanceSheetAccountsNodes', () => {
  it('keeps the original order when no column is provided', () => {
    const nodes = [
      createAggregateNode([
        createAccountsNode([
          createAccountNode({ id: 1, name: 'Beta', total: createTotal(100) }),
          createAccountNode({ id: 2, name: 'Alpha', total: createTotal(300) }),
        ]),
      ]),
    ];

    expect(sortBalanceSheetAccountsNodes(nodes)).toEqual(nodes);
  });

  it('sorts account nodes of the same parent by total in descending order', () => {
    const nodes = [
      createAggregateNode([
        createAccountsNode([
          createAccountNode({ id: 1, name: 'Beta', total: createTotal(100) }),
          createAccountNode({ id: 2, name: 'Alpha', total: createTotal(300) }),
          createAccountNode({ id: 3, name: 'Gamma', total: createTotal(200) }),
        ]),
      ]),
    ];

    const sorted = sortBalanceSheetAccountsNodes(nodes, 'total', 'desc');

    expect(getAccountChildrenNames(sorted[0])).toEqual([
      'Alpha',
      'Gamma',
      'Beta',
    ]);
  });

  it('sorts nested account children', () => {
    const nodes = [
      createAggregateNode([
        createAccountsNode([
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
      ]),
    ];

    const sorted = sortBalanceSheetAccountsNodes(nodes, 'total', 'asc');
    const accountsNode = getNodeChildren(sorted[0])[0];
    const parentNode = getNodeChildren(accountsNode)[0];

    expect(getNodeChildren(parentNode).map((node) => node.name)).toEqual([
      'Child B',
      'Child A',
    ]);
  });

  it('sorts by the formatted account name', () => {
    const nodes = [
      createAggregateNode([
        createAccountsNode([
          createAccountNode({ id: 1, name: 'Account 10' }),
          createAccountNode({ id: 2, name: 'Account 2' }),
          createAccountNode({ id: 3, name: 'Bank' }),
        ]),
      ]),
    ];

    const sorted = sortBalanceSheetAccountsNodes(nodes, 'name', 'asc');

    expect(getAccountChildrenNames(sorted[0])).toEqual([
      'Account 2',
      'Account 10',
      'Bank',
    ]);
  });

  it('sorts by the previous period amount', () => {
    const nodes = [
      createAggregateNode([
        createAccountsNode([
          createAccountNode({
            id: 1,
            name: 'Beta',
            previousPeriod: createTotal(100),
          }),
          createAccountNode({
            id: 2,
            name: 'Alpha',
            previousPeriod: createTotal(300),
          }),
        ]),
      ]),
    ];

    const sorted = sortBalanceSheetAccountsNodes(
      nodes,
      'previous_period',
      'desc',
    );

    expect(getAccountChildrenNames(sorted[0])).toEqual(['Alpha', 'Beta']);
  });

  it('keeps the structural nodes order and position', () => {
    const nodes = [
      createAggregateNode(
        [
          createAggregateNode(
            [
              createAccountsNode([
                createAccountNode({
                  id: 1,
                  name: 'Petty Cash',
                  total: createTotal(100),
                }),
                createAccountNode({
                  id: 2,
                  name: 'Cash',
                  total: createTotal(300),
                }),
              ]),
            ],
            { id: 'CURRENT_ASSETS', name: 'Current Asset' },
          ),
          createAccountsNode(
            [
              createAccountNode({
                id: 3,
                name: 'Equipment',
                total: createTotal(50),
              }),
            ],
            { id: 'FIXED_ASSET', name: 'Fixed Asset' },
          ),
        ],
        { id: 'ASSETS', name: 'Assets' },
      ),
      createAggregateNode(
        [
          createAccountsNode(
            [
              createAccountNode({
                id: 4,
                name: 'Retained Earnings',
                total: createTotal(50),
              }),
              createNetIncomeNode({ id: 5, name: 'Net Income' }),
            ],
            { id: 'EQUITY', name: 'Equity' },
          ),
        ],
        { id: 'LIABILITY_EQUITY', name: 'Liabilities and Equity' },
      ),
    ];

    const sorted = sortBalanceSheetAccountsNodes(nodes, 'total', 'desc');

    expect(sorted.map((node) => node.id)).toEqual([
      'ASSETS',
      'LIABILITY_EQUITY',
    ]);
    expect(getNodeChildren(sorted[0]).map((node) => node.id)).toEqual([
      'CURRENT_ASSETS',
      'FIXED_ASSET',
    ]);
    expect(
      getNodeChildren(getNodeChildren(sorted[1])[0]).map((n) => n.id),
    ).toEqual([4, 5]);
  });
});
