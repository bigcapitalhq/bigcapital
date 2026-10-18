import { SalesTaxLiabilitySummaryRepository } from './SalesTaxLiabilitySummaryRepository';
import { SalesTaxLiabilitySummaryQuery } from './SalesTaxLiability.types';

const createQueryBuilder = (result: unknown) => {
  const builder: any = {
    whereIn: jest.fn(() => builder),
    whereNot: jest.fn(() => builder),
    modify: jest.fn(() => builder),
    groupBy: jest.fn(() => builder),
    select: jest.fn(() => builder),
    sum: jest.fn(() => builder),
    orderBy: jest.fn(() => builder),
    then: (resolve: (value: unknown) => unknown) =>
      Promise.resolve(result).then(resolve),
  };
  return builder;
};

describe('SalesTaxLiabilitySummaryRepository', () => {
  const filter: SalesTaxLiabilitySummaryQuery = {
    fromDate: '2026-01-01',
    toDate: '2026-01-31',
    basis: 'accrual',
  };

  const setup = () => {
    const payableQuery = createQueryBuilder([
      { taxRateId: 1, credit: 100, debit: 0 },
    ]);
    const salesQuery = createQueryBuilder([
      { taxRateId: 1, credit: 1000, debit: 0 },
    ]);
    const taxRatesQuery = createQueryBuilder([
      { id: 1, name: 'Tax', rate: 10 },
    ]);
    const accountsQuery = createQueryBuilder([
      { id: 1, accountType: 'tax-payable' },
    ]);
    const transactionQueries = jest
      .fn()
      .mockReturnValueOnce(payableQuery)
      .mockReturnValueOnce(salesQuery);

    const repository = new SalesTaxLiabilitySummaryRepository();
    (repository as any).taxRateModel = jest.fn(() => ({
      query: () => taxRatesQuery,
    }));
    (repository as any).accountModel = jest.fn(() => ({
      query: () => accountsQuery,
    }));
    (repository as any).accountTransactionModel = jest.fn(() => ({
      query: transactionQueries,
    }));
    (repository as any).accountingBasisService = {
      resolve: jest.fn(async () => filter.basis),
    };

    return { repository, payableQuery, salesQuery };
  };

  it('filters the taxes payable sum by the report date range', async () => {
    const { repository, payableQuery } = setup();

    await repository.load(filter);

    expect(payableQuery.modify).toHaveBeenCalledWith(
      'filterDateRange',
      filter.fromDate,
      filter.toDate,
    );
  });

  it('filters the taxes sales sum by the report date range', async () => {
    const { repository, salesQuery } = setup();

    await repository.load(filter);

    expect(salesQuery.modify).toHaveBeenCalledWith(
      'filterDateRange',
      filter.fromDate,
      filter.toDate,
    );
  });

  it('filters the taxes payable and sales sums by the report basis', async () => {
    const { repository, payableQuery, salesQuery } = setup();

    await repository.load(filter);

    expect(payableQuery.modify).toHaveBeenCalledWith(
      'filterByBasis',
      filter.basis,
    );
    expect(salesQuery.modify).toHaveBeenCalledWith(
      'filterByBasis',
      filter.basis,
    );
  });
});
