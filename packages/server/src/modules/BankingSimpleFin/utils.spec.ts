import {
  decodeSimpleFinSetupToken,
  normalizeSimpleFinCurrency,
  parseSimpleFinAccessUrl,
  parseSimpleFinAmount,
  simpleFinEpochToDate,
  transformSimpleFinAccountToClaimed,
  transformSimpleFinAccountToCreateAccount,
  transformSimpleFinTrxToCashflowCreate,
} from './utils';

const CLAIM_URL =
  'https://beta-bridge.simplefin.org/simplefin/claim/DEMO-TOKEN';

const buildAccount = (overrides: Record<string, any> = {}) =>
  ({
    org: {
      domain: 'example-bank.com',
      name: 'Example Bank',
      'sfin-url': 'https://beta-bridge.simplefin.org/simplefin',
    },
    id: 'ACT-1',
    name: 'Everyday Checking',
    currency: 'USD',
    balance: '1250.50',
    'available-balance': '1200.00',
    'balance-date': 1762214400, // 2025-11-04T00:00:00Z
    transactions: [],
    ...overrides,
  }) as any;

const buildTransaction = (overrides: Record<string, any> = {}) =>
  ({
    id: 'TRN-1',
    posted: 1762214400, // 2025-11-04T00:00:00Z
    amount: '-42.17',
    description: 'COFFEE SHOP',
    payee: 'Coffee Shop',
    memo: 'Card purchase',
    ...overrides,
  }) as any;

describe('decodeSimpleFinSetupToken', () => {
  it('decodes a base64 setup token to the claim URL', () => {
    const token = Buffer.from(CLAIM_URL).toString('base64');

    expect(decodeSimpleFinSetupToken(token)).toBe(CLAIM_URL);
  });

  it('tolerates surrounding whitespace and newlines', () => {
    const token = `  ${Buffer.from(`${CLAIM_URL}\n`).toString('base64')}\n`;

    expect(decodeSimpleFinSetupToken(token)).toBe(CLAIM_URL);
  });

  it('rejects tokens that do not decode to an http(s) URL', () => {
    expect(decodeSimpleFinSetupToken('not-base64-url')).toBeNull();
    expect(
      decodeSimpleFinSetupToken(Buffer.from('ftp://x.y/z').toString('base64')),
    ).toBeNull();
    expect(decodeSimpleFinSetupToken('')).toBeNull();
    expect(decodeSimpleFinSetupToken(undefined as any)).toBeNull();
  });
});

describe('parseSimpleFinAccessUrl', () => {
  it('splits the credentials from the base URL', () => {
    const parsed = parseSimpleFinAccessUrl(
      'https://user%40x:p%2Fass@beta-bridge.simplefin.org/simplefin/',
    );
    expect(parsed).toEqual({
      baseUrl: 'https://beta-bridge.simplefin.org/simplefin',
      username: 'user@x',
      password: 'p/ass',
    });
  });

  it('returns empty credentials when the URL has none', () => {
    const parsed = parseSimpleFinAccessUrl('https://example.com/simplefin');

    expect(parsed.username).toBe('');
    expect(parsed.password).toBe('');
  });
});

describe('simpleFinEpochToDate', () => {
  it('converts unix seconds to a UTC YYYY-MM-DD date', () => {
    expect(simpleFinEpochToDate(1762214400)).toBe('2025-11-04');
  });

  it('returns null for zero or missing timestamps', () => {
    expect(simpleFinEpochToDate(0)).toBeNull();
    expect(simpleFinEpochToDate(undefined)).toBeNull();
  });
});

describe('parseSimpleFinAmount', () => {
  it('parses numeric strings and passes through numbers', () => {
    expect(parseSimpleFinAmount('-42.17')).toBe(-42.17);
    expect(parseSimpleFinAmount(10)).toBe(10);
  });

  it('falls back to zero for garbage', () => {
    expect(parseSimpleFinAmount('abc')).toBe(0);
  });
});

describe('normalizeSimpleFinCurrency', () => {
  it('accepts ISO 4217 codes case-insensitively', () => {
    expect(normalizeSimpleFinCurrency('usd')).toBe('USD');
  });

  it('rejects custom currency URLs', () => {
    expect(
      normalizeSimpleFinCurrency('https://example.com/currencies/points'),
    ).toBeNull();
    expect(normalizeSimpleFinCurrency(undefined)).toBeNull();
  });
});

describe('transformSimpleFinAccountToClaimed', () => {
  it('maps the account to the claim response shape', () => {
    expect(transformSimpleFinAccountToClaimed(buildAccount())).toEqual({
      id: 'ACT-1',
      name: 'Everyday Checking',
      currency: 'USD',
      balance: 1250.5,
      availableBalance: 1200,
      balanceDate: '2025-11-04',
      connectionName: 'Example Bank',
    });
  });

  it('falls back to the org domain and null available balance', () => {
    const claimed = transformSimpleFinAccountToClaimed(
      buildAccount({
        org: { domain: 'example-bank.com', 'sfin-url': 'x' },
        'available-balance': undefined,
      }),
    );
    expect(claimed.connectionName).toBe('example-bank.com');
    expect(claimed.availableBalance).toBeNull();
  });
});

describe('transformSimpleFinAccountToCreateAccount', () => {
  it('creates a bank account DTO prefixed with the connection name', () => {
    const dto = transformSimpleFinAccountToCreateAccount(
      'item-1',
      'bank',
      'EUR',
      buildAccount(),
    );
    expect(dto).toMatchObject({
      name: 'Example Bank - Everyday Checking',
      currencyCode: 'USD',
      accountType: 'bank',
      active: true,
      bankBalance: 1250.5,
      simplefinAccountId: 'ACT-1',
      simplefinItemId: 'item-1',
    });
  });

  it('maps the credit card type and falls back to the base currency', () => {
    const dto = transformSimpleFinAccountToCreateAccount(
      'item-1',
      'credit-card',
      'EUR',
      buildAccount({ currency: 'https://example.com/points' }),
    );
    expect(dto.accountType).toBe('credit-card');
    expect(dto.currencyCode).toBe('EUR');
  });

  it('treats any other type as a bank account', () => {
    const dto = transformSimpleFinAccountToCreateAccount(
      'item-1',
      'something-else',
      'EUR',
      buildAccount(),
    );
    expect(dto.accountType).toBe('bank');
  });
});

describe('transformSimpleFinTrxToCashflowCreate', () => {
  it('keeps the SimpleFIN sign convention (positive = deposit)', () => {
    const dto = transformSimpleFinTrxToCashflowCreate(
      7,
      'USD',
      buildTransaction(),
    );
    expect(dto).toEqual({
      date: '2025-11-04',
      amount: -42.17,
      description: 'COFFEE SHOP',
      payee: 'Coffee Shop',
      currencyCode: 'USD',
      accountId: 7,
      simplefinTransactionId: 'TRN-1',
      pending: false,
    });
  });

  it('falls back to transacted_at when posted is zero', () => {
    const dto = transformSimpleFinTrxToCashflowCreate(
      7,
      'USD',
      buildTransaction({ posted: 0, transacted_at: 1762300800, pending: true }),
    );
    expect(dto.date).toBe('2025-11-05');
    expect(dto.pending).toBe(true);
  });

  it('uses the memo when the description is empty', () => {
    const dto = transformSimpleFinTrxToCashflowCreate(
      7,
      'USD',
      buildTransaction({ description: '' }),
    );
    expect(dto.description).toBe('Card purchase');
  });

  it('truncates the payee to the column length', () => {
    const dto = transformSimpleFinTrxToCashflowCreate(
      7,
      'USD',
      buildTransaction({ payee: 'P'.repeat(300) }),
    );
    expect(dto.payee).toBe('P'.repeat(255));
  });
});
