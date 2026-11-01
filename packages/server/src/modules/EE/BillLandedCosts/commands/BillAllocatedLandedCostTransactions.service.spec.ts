import { BillAllocatedLandedCostTransactions } from './BillAllocatedLandedCostTransactions.service';

describe('BillAllocatedLandedCostTransactions', () => {
  let i18nService: { t: jest.Mock };
  let billModel: jest.Mock;
  let billLandedCostModel: jest.Mock;
  let service: BillAllocatedLandedCostTransactions;

  const buildTransactionModel = (data: Record<string, any>) => ({
    ...data,
    toJSON: () => data,
  });

  const buildQueryChain = (transactions: any[]) => {
    const queryBuilder: any = {};
    queryBuilder.withGraphFetched = jest
      .fn()
      .mockImplementationOnce(() => queryBuilder)
      .mockImplementationOnce(() => queryBuilder)
      .mockImplementationOnce(() => queryBuilder)
      .mockImplementationOnce(() => Promise.resolve(transactions));

    const where = jest.fn(() => queryBuilder);
    const query = jest.fn(() => ({ where }));
    billLandedCostModel.mockReturnValue({ query });
    return { query, where };
  };

  beforeEach(() => {
    i18nService = { t: jest.fn((key) => `translated:${key}`) };
    billModel = jest.fn(() => ({
      query: jest.fn(() => ({
        findById: jest.fn(() => ({
          throwIfNotFound: jest.fn().mockResolvedValue({ id: 7 }),
        })),
      })),
    }));
    billLandedCostModel = jest.fn();
    service = new BillAllocatedLandedCostTransactions(
      i18nService as any,
      billModel as any,
      billLandedCostModel as any,
    );
  });

  it('transforms bill landed cost transactions', async () => {
    const transactions = [
      buildTransactionModel({
        id: 1,
        fromTransactionType: 'Bill',
        amount: 100,
        currencyCode: 'USD',
        localAmount: 100,
        allocationMethodFormatted: 'bill.allocation_method.value',
        allocatedFromBillEntry: {
          item: { name: 'Ocean freight' },
          description: 'Freight bill',
        },
      }),
      buildTransactionModel({
        id: 2,
        fromTransactionType: 'Expense',
        amount: 50,
        currencyCode: 'USD',
        localAmount: 50,
        allocationMethodFormatted: 'bill.allocation_method.quantity',
        allocatedFromExpenseEntry: {
          expenseAccount: { name: 'Customs' },
          description: 'Customs expense',
        },
      }),
    ];
    buildQueryChain(transactions);

    const result = await service.getBillLandedCostTransactions(7);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 1,
      name: 'Ocean freight',
      description: 'Freight bill',
      formattedAmount: '$100.00',
      formattedLocalAmount: '$100.00',
      allocationMethodFormatted: 'translated:bill.allocation_method.value',
    });
    expect(result[0]).not.toHaveProperty('allocatedFromBillEntry');

    expect(result[1]).toMatchObject({
      id: 2,
      name: 'Customs',
      description: 'Customs expense',
      formattedAmount: '$50.00',
      allocationMethodFormatted: 'translated:bill.allocation_method.quantity',
    });
    expect(result[1]).not.toHaveProperty('allocatedFromExpenseEntry');

    expect(i18nService.t).toHaveBeenCalledWith(
      'bill.allocation_method.value',
      expect.anything(),
    );
  });

  it('throws when the bill does not exist', async () => {
    billModel.mockReturnValue({
      query: jest.fn(() => ({
        findById: jest.fn(() => ({
          throwIfNotFound: jest.fn().mockRejectedValue(new Error('not found')),
        })),
      })),
    });

    await expect(service.getBillLandedCostTransactions(7)).rejects.toThrow(
      'not found',
    );
  });
});
