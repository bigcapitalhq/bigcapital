import { flatToNestedArray } from './flat-to-nested-array';
import {
  compareAccountsByCode,
  sortAccountsByCode,
} from './sort-accounts-by-code';

interface TestAccount {
  id: number;
  name: string;
  code: string | null;
  parentAccountId: number | null;
  children?: TestAccount[];
}

const account = (
  id: number,
  code: string | null,
  name = `Account ${id}`,
  parentAccountId: number | null = null,
): TestAccount => ({ id, code, name, parentAccountId });

const codes = (accounts: TestAccount[]) =>
  accounts.map((item) => item.code ?? item.name);

describe('compareAccountsByCode', () => {
  it('compares codes as numbers', () => {
    const sorted = [
      account(1, '10001'),
      account(2, '1010'),
      account(3, '6355'),
      account(4, '6030'),
    ].sort(compareAccountsByCode);

    expect(codes(sorted)).toEqual(['1010', '6030', '6355', '10001']);
  });

  it('puts accounts without a code last, by name', () => {
    const sorted = [
      account(1, null, 'Zeta'),
      account(2, '', 'Alpha'),
      account(3, '4000'),
      account(4, '  ', 'Beta'),
    ].sort(compareAccountsByCode);

    expect(sorted.map((item) => item.name)).toEqual([
      'Account 3',
      'Alpha',
      'Beta',
      'Zeta',
    ]);
  });

  it('breaks a tie on the code by name, then by id', () => {
    const sorted = [
      account(3, '30003', 'Owner Equity'),
      account(1, '30003', 'Drawings'),
      account(2, '30003', 'Drawings'),
    ].sort(compareAccountsByCode);

    expect(sorted.map((item) => item.id)).toEqual([1, 2, 3]);
  });
});

describe('sortAccountsByCode', () => {
  // Created in this order, as a template or an import would: the seeded
  // accounts first, then the ones added later.
  const chart = () => [
    account(1, '6600', 'Office Expenses'),
    account(2, '6200', 'Rent'),
    account(3, '6000', 'Payroll - Wages'),
    account(4, '6380', 'Tolls and Parking', 6),
    account(5, '6360', 'Fuel', 6),
    account(6, '6355', 'Vehicle'),
    account(7, '6030', 'Subcontracted - Non-Core'),
  ];

  it('orders the accounts by code', () => {
    expect(codes(sortAccountsByCode(chart()))).toEqual([
      '6000',
      '6030',
      '6200',
      '6355',
      '6360',
      '6380',
      '6600',
    ]);
  });

  it('keeps each subaccount right after its parent, whatever its code', () => {
    const accounts = [
      ...chart(),
      // A subaccount of Vehicle whose code sorts before everything else.
      account(8, '5900', 'Vehicle Leasing', 6),
    ];

    expect(codes(sortAccountsByCode(accounts))).toEqual([
      '6000',
      '6030',
      '6200',
      '6355',
      '5900',
      '6360',
      '6380',
      '6600',
    ]);
  });

  it('orders each level of a nested tree by code', () => {
    const accounts = [
      ...chart(),
      account(8, '6362', 'Fuel - Diesel', 5),
      account(9, '6361', 'Fuel - Gasoline', 5),
    ];
    const tree = flatToNestedArray(sortAccountsByCode(accounts), {
      id: 'id',
      parentId: 'parentAccountId',
    }) as TestAccount[];

    expect(codes(tree)).toEqual(['6000', '6030', '6200', '6355', '6600']);

    const vehicle = tree.find((item) => item.code === '6355');
    expect(codes(vehicle.children)).toEqual(['6360', '6380']);
    expect(codes(vehicle.children[0].children)).toEqual(['6361', '6362']);
  });

  it('places an account whose parent is not in the list at the top level', () => {
    const accounts = [account(1, '6360', 'Fuel', 99), account(2, '6000')];

    expect(codes(sortAccountsByCode(accounts))).toEqual(['6000', '6360']);
  });

  it('keeps accounts caught in a parent cycle', () => {
    const accounts = [
      account(1, '6100', 'A', 2),
      account(2, '6200', 'B', 1),
      account(3, '6000'),
    ];

    expect(codes(sortAccountsByCode(accounts))).toEqual([
      '6000',
      '6100',
      '6200',
    ]);
  });

  it('returns a new array and leaves the given one as it is', () => {
    const accounts = chart();
    const before = codes(accounts);

    expect(sortAccountsByCode(accounts)).not.toBe(accounts);
    expect(codes(accounts)).toEqual(before);
  });
});
