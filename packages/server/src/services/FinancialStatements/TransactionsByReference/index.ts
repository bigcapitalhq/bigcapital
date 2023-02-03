import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  ITransactionsByReferenceQuery,
  ITransactionsByReferenceTransaction,
} from '@/interfaces';
import TransactionsByReferenceRepository from './TransactionsByReferenceRepository';
import TransactionsByReferenceReport from './TransactionsByReferenceReport';

@Service()
export default class TransactionsByReferenceService {
  @Inject()
  tenancy: HasTenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  reportRepository: TransactionsByReferenceRepository;

  /**
   * Default query of transactions by reference report.
   */
  get defaultQuery(): ITransactionsByReferenceQuery {
    return {
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
    };
  }

  /**
   * Retrieve accounts transactions by given reference id and type.
   * @param {number} tenantId
   * @param {ITransactionsByReferenceQuery} filter
   */
  public async getTransactionsByReference(
    tenantId: number,
    query: ITransactionsByReferenceQuery
  ): Promise<{
    transactions: ITransactionsByReferenceTransaction[];
  }> {
    const filter = {
      ...this.defaultQuery,
      ...query,
    };

    // Retrieve the accounts transactions of the given reference.
    const transactions = await this.reportRepository.getTransactions(
      tenantId,
      filter.referenceId,
      filter.referenceType
    );

    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    // Transactions by reference report.
    const report = new TransactionsByReferenceReport(
      transactions,
      filter,
      baseCurrency
    );

    return {
      transactions: report.reportData(),
    };
  }
}
