import { GetMatchedTransactions } from './GetMatchedTransactions.service';

describe('GetMatchedTransactions', () => {
  const buildTypeService = () => ({
    getMatchedTransactions: jest.fn().mockResolvedValue([]),
  });

  let invoices: ReturnType<typeof buildTypeService>;
  let bills: ReturnType<typeof buildTypeService>;
  let journals: ReturnType<typeof buildTypeService>;
  let expenses: ReturnType<typeof buildTypeService>;
  let cashflow: ReturnType<typeof buildTypeService>;
  let uncategorizedTransactions: Array<Record<string, unknown>>;
  let service: GetMatchedTransactions;

  beforeEach(() => {
    invoices = buildTypeService();
    bills = buildTypeService();
    journals = buildTypeService();
    expenses = buildTypeService();
    cashflow = buildTypeService();

    // Two bank transactions of the same bank account (id 7).
    uncategorizedTransactions = [
      { id: 1, accountId: 7, amount: 100, date: '2026-11-01' },
      { id: 2, accountId: 7, amount: 50, date: '2026-11-01' },
    ];
    // Read at query time, so a test can replace the bank transactions.
    const uncategorizedModel = jest.fn(() => ({
      query: jest.fn(() => ({
        whereIn: jest.fn(() => ({
          throwIfNotFound: jest.fn(() =>
            Promise.resolve(uncategorizedTransactions),
          ),
        })),
      })),
    }));
    service = new GetMatchedTransactions(
      invoices as any,
      bills as any,
      journals as any,
      expenses as any,
      cashflow as any,
      uncategorizedModel as any,
    );
  });

  it('passes the accounts of the bank transactions to every type service', async () => {
    await service.getMatchedTransactions([1, 2], {} as any);

    for (const typeService of [invoices, bills, journals, expenses, cashflow]) {
      expect(typeService.getMatchedTransactions).toHaveBeenCalledWith(
        expect.objectContaining({ accountIds: [7] }),
      );
    }
  });

  it('passes every account when the bank transactions span accounts', async () => {
    uncategorizedTransactions = [
      { id: 1, accountId: 7, amount: 100, date: '2026-11-01' },
      { id: 3, accountId: 9, amount: 20, date: '2026-11-01' },
    ];

    await service.getMatchedTransactions([1, 3], {} as any);

    expect(journals.getMatchedTransactions).toHaveBeenCalledWith(
      expect.objectContaining({ accountIds: [7, 9] }),
    );
  });

  it('ignores an accountIds value sent by the client', async () => {
    await service.getMatchedTransactions([1, 2], {
      accountIds: [1000],
    } as any);

    expect(journals.getMatchedTransactions).toHaveBeenCalledWith(
      expect.objectContaining({ accountIds: [7] }),
    );
  });
});
