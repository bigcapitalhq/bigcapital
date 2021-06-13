import { Service, Inject } from 'typedi';
import moment from 'moment';
import {
  IBalanceSheetStatementService,
  IBalanceSheetQuery,
  IBalanceSheetStatement,
  IBalanceSheetMeta,
} from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import Journal from 'services/Accounting/JournalPoster';
import BalanceSheetStatement from './BalanceSheet';
import InventoryService from 'services/Inventory/Inventory';
import { parseBoolean } from 'utils';

@Service()
export default class BalanceSheetStatementService
  implements IBalanceSheetStatementService {
  @Inject()
  tenancy: TenancyService;

  @Inject('logger')
  logger: any;

  @Inject()
  inventoryService: InventoryService;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): IBalanceSheetQuery {
    return {
      displayColumnsType: 'total',
      displayColumnsBy: 'day',
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
      noneZero: false,
      noneTransactions: false,
      basis: 'cash',
      accountIds: [],
    };
  }

  /**
   * Retrieve the balance sheet meta.
   * @param {number} tenantId - 
   * @returns {IBalanceSheetMeta}
   */
  private reportMetadata(tenantId: number): IBalanceSheetMeta {
    const settings = this.tenancy.settings(tenantId);

    const isCostComputeRunning = this.inventoryService
      .isItemsCostComputeRunning(tenantId);

    const organizationName = settings.get({
      group: 'organization',
      key: 'name',
    });
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    return {
      isCostComputeRunning: parseBoolean(isCostComputeRunning, false),
      organizationName,
      baseCurrency
    };
  }

  /**
   * Retrieve balance sheet statement.
   * -------------
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   *
   * @return {IBalanceSheetStatement}
   */
  public async balanceSheet(
    tenantId: number,
    query: IBalanceSheetQuery
  ): Promise<IBalanceSheetStatement> {
    const {
      accountRepository,
      transactionsRepository,
    } = this.tenancy.repositories(tenantId);

    const i18n = this.tenancy.i18n(tenantId);

    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization', key: 'base_currency',
    });

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[balance_sheet] trying to calculate the report.', {
      filter,
      tenantId,
    });
    // Retrieve all accounts on the storage.
    const accounts = await accountRepository.all();
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve all journal transactions based on the given query.
    const transactions = await transactionsRepository.journal({
      fromDate: query.fromDate,
    toDate: query.toDate,
    });
    // Transform transactions to journal collection.
    const transactionsJournal = Journal.fromTransactions(
      transactions,
      tenantId,
      accountsGraph
    );
    // Balance sheet report instance.
    const balanceSheetInstanace = new BalanceSheetStatement(
      tenantId,
      filter,
      accounts,
      transactionsJournal,
      baseCurrency,
      i18n
    );
    // Balance sheet data.
    const balanceSheetData = balanceSheetInstanace.reportData();

    // Retrieve balance sheet columns.
    const balanceSheetColumns = balanceSheetInstanace.reportColumns();

    return {
      data: balanceSheetData,
      columns: balanceSheetColumns,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
