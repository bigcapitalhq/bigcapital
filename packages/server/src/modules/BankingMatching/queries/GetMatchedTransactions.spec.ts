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
  let service: GetMatchedTransactions;

  beforeEach(() => {
    invoices = buildTypeService();
    bills = buildTypeService();
    journals = buildTypeService();
    expenses = buildTypeService();
    cashflow = buildTypeService();

    // Two bank transactions of the same bank account (id 7).
    const uncategorizedTransactions = [
      { id: 1, accountId: 7, amount: 100, date: '2026-11-01' },
      { id: 2, accountId: 7, amount: 50, date: '2026-11-01' },
    ];
    const uncategorizedModel = jest.fn(() => ({
      query: jest.fn(() => ({
        whereIn: jest.fn(() => ({
          throwIfNotFound: jest
            .fn()
            .mockResolvedValue(uncategorizedTransactions),
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

  it('ignores an accountIds value sent by the client', async () => {
    await service.getMatchedTransactions([1, 2], {
      accountIds: [1000],
    } as any);

    expect(journals.getMatchedTransactions).toHaveBeenCalledWith(
      expect.objectContaining({ accountIds: [7] }),
    );
  });
});
