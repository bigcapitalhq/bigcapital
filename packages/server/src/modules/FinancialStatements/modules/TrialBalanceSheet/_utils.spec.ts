import { ITrialBalanceAccount } from './TrialBalanceSheet.types';
import { sortTrialBalanceAccounts } from './_utils';

const createAccount = (
  overrides: Partial<ITrialBalanceAccount> = {},
): ITrialBalanceAccount => ({
  id: 1,
  parentAccountId: null,
  name: 'Account',
  formattedName: 'Account',
  code: '1000',
  accountNormal: 'debit',
  credit: 0,
  debit: 0,
  balance: 0,
  currencyCode: 'USD',
  formattedCredit: '',
  formattedDebit: '',
  formattedBalance: '',
  ...overrides,
});

describe('sortTrialBalanceAccounts', () => {
  it('keeps the original order when no column is provided', () => {
    const accounts = [
      createAccount({ id: 1, name: 'Beta', formattedName: 'Beta' }),
      createAccount({ id: 2, name: 'Alpha', formattedName: 'Alpha' }),
    ];

    expect(sortTrialBalanceAccounts(accounts)).toEqual(accounts);
  });

  it('sorts accounts by debit in descending order', () => {
    const accounts = [
      createAccount({ id: 1, name: 'Beta', formattedName: 'Beta', debit: 100 }),
      createAccount({
        id: 2,
        name: 'Alpha',
        formattedName: 'Alpha',
        debit: 300,
      }),
      createAccount({
        id: 3,
        name: 'Gamma',
        formattedName: 'Gamma',
        debit: 200,
      }),
    ];

    expect(
      sortTrialBalanceAccounts(accounts, 'debit', 'desc').map(
        (account) => account.name,
      ),
    ).toEqual(['Alpha', 'Gamma', 'Beta']);
  });

  it('sorts accounts by credit in ascending order', () => {
    const accounts = [
      createAccount({
        id: 1,
        name: 'Beta',
        formattedName: 'Beta',
        credit: 100,
      }),
      createAccount({
        id: 2,
        name: 'Alpha',
        formattedName: 'Alpha',
        credit: 300,
      }),
      createAccount({
        id: 3,
        name: 'Gamma',
        formattedName: 'Gamma',
        credit: 200,
      }),
    ];

    expect(
      sortTrialBalanceAccounts(accounts, 'credit', 'asc').map(
        (account) => account.name,
      ),
    ).toEqual(['Beta', 'Gamma', 'Alpha']);
  });

  it('sorts accounts by balance using the total column', () => {
    const accounts = [
      createAccount({
        id: 1,
        name: 'Beta',
        formattedName: 'Beta',
        balance: -100,
      }),
      createAccount({
        id: 2,
        name: 'Alpha',
        formattedName: 'Alpha',
        balance: 300,
      }),
      createAccount({
        id: 3,
        name: 'Gamma',
        formattedName: 'Gamma',
        balance: 0,
      }),
    ];

    expect(
      sortTrialBalanceAccounts(accounts, 'total', 'desc').map(
        (account) => account.name,
      ),
    ).toEqual(['Alpha', 'Gamma', 'Beta']);
  });

  it('sorts accounts by their formatted name', () => {
    const accounts = [
      createAccount({ id: 1, formattedName: 'Account 10' }),
      createAccount({ id: 2, formattedName: 'Account 2' }),
      createAccount({ id: 3, formattedName: 'Bank' }),
    ];

    expect(
      sortTrialBalanceAccounts(accounts, 'account', 'asc').map(
        (account) => account.formattedName,
      ),
    ).toEqual(['Account 2', 'Account 10', 'Bank']);
  });
});
