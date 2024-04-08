import {
  IAccountTransaction,
  ICashFlowStatementDOO,
  ICashFlowStatementQuery,
  ICashFlowStatementService,
} from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';
import InventoryService from '@/services/Inventory/Inventory';
import TenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';
import moment from 'moment';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import FinancialSheet from '../FinancialSheet';
import CashFlowStatement from './CashFlow';
import CashFlowRepository from './CashFlowRepository';
import { CashflowSheetMeta } from './CashflowSheetMeta';

@Service()
export default class CashFlowStatementService extends FinancialSheet implements ICashFlowStatementService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  cashFlowRepo: CashFlowRepository;

  @Inject()
  inventoryService: InventoryService;

  @Inject()
  private cashflowSheetMeta: CashflowSheetMeta;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): ICashFlowStatementQuery {
    return {
      displayColumnsType: 'total',
      displayColumnsBy: 'day',
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
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
    };
  }

  /**
   * Retrieve cash at beginning transactions.
   * @param {number} tenantId -
   * @param {ICashFlowStatementQuery} filter -
   * @retrun {Promise<IAccountTransaction[]>}
   */
  private async cashAtBeginningTransactions(
    tenantId: number,
    filter: ICashFlowStatementQuery,
  ): Promise<IAccountTransaction[]> {
    const appendPeriodsOperToChain = (trans) =>
      R.append(this.cashFlowRepo.cashAtBeginningPeriodTransactions(tenantId, filter), trans);

    const promisesChain = R.pipe(
      R.append(this.cashFlowRepo.cashAtBeginningTotalTransactions(tenantId, filter)),
      R.when(R.always(R.equals(filter.displayColumnsType, 'date_periods')), appendPeriodsOperToChain),
    )([]);
    const promisesResults = await Promise.all(promisesChain);
    const transactions = R.flatten(promisesResults);

    return transactions;
  }

  /**
   * Retrieve the cash flow sheet statement.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<ICashFlowStatementDOO>}
   */
  public async cashFlow(tenantId: number, query: ICashFlowStatementQuery): Promise<ICashFlowStatementDOO> {
    const i18n = this.tenancy.i18n(tenantId);

    // Retrieve all accounts on the storage.
    const accounts = await this.cashFlowRepo.cashFlowAccounts(tenantId);

    const tenant = await Tenant.query().findById(tenantId).withGraphFetched('metadata');

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    // Retrieve the accounts transactions.
    const transactions = await this.cashFlowRepo.getAccountsTransactions(tenantId, filter);
    // Retrieve the net income transactions.
    const netIncome = await this.cashFlowRepo.getNetIncomeTransactions(tenantId, filter);
    // Retrieve the cash at beginning transactions.
    const cashAtBeginningTransactions = await this.cashAtBeginningTransactions(tenantId, filter);
    // Transformes the transactions to ledgers.
    const ledger = Ledger.fromTransactions(transactions);
    const cashLedger = Ledger.fromTransactions(cashAtBeginningTransactions);
    const netIncomeLedger = Ledger.fromTransactions(netIncome);

    // Cash flow statement.
    const cashFlowInstance = new CashFlowStatement(
      accounts,
      ledger,
      cashLedger,
      netIncomeLedger,
      filter,
      tenant.metadata.baseCurrency,
      i18n,
    );
    // Retrieve the cashflow sheet meta.
    const meta = await this.cashflowSheetMeta.meta(tenantId, filter);

    return {
      data: cashFlowInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
