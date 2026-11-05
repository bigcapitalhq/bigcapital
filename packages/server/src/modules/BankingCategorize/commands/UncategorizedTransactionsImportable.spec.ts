import { UncategorizedTransactionsImportable } from './UncategorizedTransactionsImportable';
import { ImportModelShape } from '../../Import/models/Import';

const makeImportable = (existing: Record<string, any>[]) => {
  const query = {
    where: jest.fn().mockReturnThis(),
    whereBetween: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue(existing),
  };
  const queryFactory = jest.fn(() => query);
  const uncategorizedModel = () => ({ query: queryFactory });
  const importable = new UncategorizedTransactionsImportable(
    {} as any,
    (() => ({})) as any,
    uncategorizedModel as any,
  );
  return { importable, query, queryFactory };
};

const importFile = {
  paramsParsed: { accountId: 1600 },
} as unknown as ImportModelShape;

describe('UncategorizedTransactionsImportable.getSkippedRows', () => {
  it('skips file rows already in the account', async () => {
    const { importable, query, queryFactory } = makeImportable([
      {
        date: new Date(2026, 0, 8),
        amount: '-5.00',
        payee: 'Tim Hortons',
        description: null,
        referenceNo: null,
      },
    ]);
    const parsed = [
      { date: '2026-01-07', amount: 20, payee: 'Shop' },
      { date: '2026-01-08', amount: -5, payee: 'tim hortons' },
    ];

    const skipped = await importable.getSkippedRows(parsed, importFile);

    expect(skipped).toEqual([
      {
        index: 1,
        errorCode: 'DuplicateBankTransaction',
        errorMessage:
          'Already in this bank account: 2026-01-08, tim hortons, -5.00',
      },
    ]);
    expect(queryFactory).toHaveBeenCalledTimes(1);
    expect(query.where).toHaveBeenCalledWith('accountId', 1600);
    expect(query.whereBetween).toHaveBeenCalledWith('date', [
      '2026-01-07',
      '2026-01-08',
    ]);
  });

  it('ignores rows with invalid dates and does not throw', async () => {
    const { importable, query } = makeImportable([]);
    const parsed = [
      { date: 'not a date', amount: -5 },
      { date: '2026-01-08', amount: -5, payee: 'x' },
    ];

    const skipped = await importable.getSkippedRows(parsed, importFile);

    expect(skipped).toEqual([]);
    expect(query.whereBetween).toHaveBeenCalledWith('date', [
      '2026-01-08',
      '2026-01-08',
    ]);
  });

  it('returns no rows without querying when no row has a valid date', async () => {
    const { importable, queryFactory } = makeImportable([]);

    const skipped = await importable.getSkippedRows(
      [{ date: '', amount: -5 }],
      importFile,
    );

    expect(skipped).toEqual([]);
    expect(queryFactory).not.toHaveBeenCalled();
  });
});
