import {
  buildBankTransactionUniqueId,
  isAnzBankStatementSheet,
  transformAnzStatementRows,
} from '../AnzBankStatementFormat';

// Rows shaped like a real ANZ (NZ) CSV export.
const anzRows = () => [
  {
    Type: 'Visa Purchase',
    Details: '4037-****-****-4028  Df',
    Particulars: '',
    Code: 'Dd *Doordash',
    Reference: '',
    Amount: '-95.78',
    Date: '03/07/2026',
    ForeignCurrencyAmount: '',
    ConversionCharge: '',
  },
  {
    Type: 'Eft-Pos',
    Details: 'Sushi Zen',
    Particulars: '4037********',
    Code: '4028   C',
    Reference: '260703133957',
    Amount: '-14.40',
    Date: '03/07/2026',
    ForeignCurrencyAmount: '',
    ConversionCharge: '',
  },
  {
    Type: 'Direct Credit',
    Details: 'Akqa Ltd',
    Particulars: '',
    Code: '',
    Reference: '19236',
    Amount: '25116.00',
    Date: '11/06/2026',
    ForeignCurrencyAmount: '',
    ConversionCharge: '',
  },
  {
    Type: 'Visa Purchase',
    Details: '4037-****-****-4028  If',
    Particulars: '      0.56',
    Code: 'Engenious  I',
    Reference: '        6.88',
    Amount: '-536.81',
    Date: '26/06/2026',
    ForeignCurrencyAmount: 'USD 299.99 converted at 0.56',
    ConversionCharge: 'This includes a currency conversion charge of $6.88',
  },
];

describe('isAnzBankStatementSheet', () => {
  it('detects the ANZ export signature', () => {
    expect(isAnzBankStatementSheet(anzRows())).toBe(true);
  });


  it('detects via explicit sheet columns when rows omit empty cells', () => {
    const sparseRow = {
      Type: 'Visa Purchase',
      Details: '4037-****-****-4028  Df',
      Code: 'Dd *Doordash',
      Amount: '-95.78',
      Date: '03/07/2026',
    };
    const columns = [
      'Type','Details','Particulars','Code','Reference','Amount','Date',
      'ForeignCurrencyAmount','ConversionCharge',
    ];
    expect(isAnzBankStatementSheet([sparseRow], columns)).toBe(true);
    // union-of-keys fallback fails for a single sparse row (by design).
    expect(isAnzBankStatementSheet([sparseRow])).toBe(false);
  });

  it('rejects a generic bank sheet', () => {
    expect(
      isAnzBankStatementSheet([
        { Date: '2026-01-01', Amount: '-10', Payee: 'X' },
      ]),
    ).toBe(false);
    expect(isAnzBankStatementSheet([])).toBe(false);
  });
});

describe('transformAnzStatementRows', () => {
  it('resolves the payee from Code for card transactions', () => {
    const [visa] = transformAnzStatementRows(anzRows());
    expect(visa.Details).toBe('Dd *Doordash');
  });

  it('resolves the payee from Details for non-card transactions', () => {
    const rows = transformAnzStatementRows(anzRows());
    expect(rows[1].Details).toBe('Sushi Zen'); // Eft-Pos
    expect(rows[2].Details).toBe('Akqa Ltd'); // Direct Credit
  });

  it('converts dd/MM/yyyy dates to ISO', () => {
    const rows = transformAnzStatementRows(anzRows());
    expect(rows[0].Date).toBe('2026-07-03');
    expect(rows[2].Date).toBe('2026-06-11');
  });

  it('describes the transaction type with FX details', () => {
    const rows = transformAnzStatementRows(anzRows());
    expect(rows[0].Particulars).toBe('Visa Purchase');
    expect(rows[3].Particulars).toBe(
      'Visa Purchase - USD 299.99 converted at 0.56',
    );
  });

  it('suffixes exact duplicate rows so each keeps a unique reference', () => {
    const duplicate = {
      Type: 'Visa Purchase',
      Details: '4037-****-****-4028  Df',
      Particulars: '',
      Code: 'Smz*Salt Caf',
      Reference: '',
      Amount: '-6.20',
      Date: '02/07/2026',
      ForeignCurrencyAmount: '',
      ConversionCharge: '',
    };
    const rows = transformAnzStatementRows([
      { ...duplicate },
      { ...duplicate },
      { ...duplicate },
    ]);
    expect(rows[0].Reference).toBe('');
    expect(rows[1].Reference).toBe('#2');
    expect(rows[2].Reference).toBe('#3');
  });
});

describe('buildBankTransactionUniqueId', () => {
  const dto = {
    date: '2026-07-03',
    amount: -95.78,
    payee: 'Dd *Doordash',
    referenceNo: '',
  };

  it('is deterministic for the same transaction', () => {
    expect(buildBankTransactionUniqueId(1000, dto)).toBe(
      buildBankTransactionUniqueId(1000, { ...dto }),
    );
  });

  it('differs across accounts, amounts and references', () => {
    const base = buildBankTransactionUniqueId(1000, dto);
    expect(buildBankTransactionUniqueId(1001, dto)).not.toBe(base);
    expect(
      buildBankTransactionUniqueId(1000, { ...dto, amount: -95.79 }),
    ).not.toBe(base);
    expect(
      buildBankTransactionUniqueId(1000, { ...dto, referenceNo: '#2' }),
    ).not.toBe(base);
  });

  it('normalizes date objects and strings to the same id', () => {
    expect(
      buildBankTransactionUniqueId(1000, {
        ...dto,
        date: new Date('2026-07-03T00:00:00Z'),
      }),
    ).toBe(buildBankTransactionUniqueId(1000, dto));
  });
});
