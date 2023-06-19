import { Service, Inject } from 'typedi';
import moment from 'moment';
import { ServiceError } from '@/exceptions';
import { difference } from 'lodash';
import { IGeneralLedgerSheetQuery, IGeneralLedgerMeta } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import Journal from '@/services/Accounting/JournalPoster';
import GeneralLedgerSheet from '@/services/FinancialStatements/GeneralLedger/GeneralLedger';
import InventoryService from '@/services/Inventory/Inventory';
import { transformToMap, parseBoolean } from 'utils';
import { Tenant } from '@/system/models';

const ERRORS = {
  ACCOUNTS_NOT_FOUND: 'ACCOUNTS_NOT_FOUND',
};

@Service()
export default class GeneralLedgerService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  inventoryService: InventoryService;

  @Inject('logger')
  logger: any;

  /**
   * Defaults general ledger report filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery() {
    return {
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
      basis: 'cash',
      numberFormat: {
        noCents: false,
        divideOn1000: false,
      },
      noneZero: false,
      accountsIds: [],
    };
  }

  /**
   * Validates accounts existence on the storage.
   * @param {number} tenantId
   * @param {number[]} accountsIds
   */
  async validateAccountsExistence(tenantId: number, accountsIds: number[]) {
    const { Account } = this.tenancy.models(tenantId);

    const storedAccounts = await Account.query().whereIn('id', accountsIds);
    const storedAccountsIds = storedAccounts.map((a) => a.id);

    if (difference(accountsIds, storedAccountsIds).length > 0) {
      throw new ServiceError(ERRORS.ACCOUNTS_NOT_FOUND);
    }
  }

  /**
   * Retrieve the balance sheet meta.
   * @param {number} tenantId - 
   * @returns {IGeneralLedgerMeta}
   */
   reportMetadata(tenantId: number): IGeneralLedgerMeta {
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
   * Retrieve general ledger report statement.
   * ----------
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   * @return {IGeneralLedgerStatement}
   */
  async generalLedger(
    tenantId: number,
    query: IGeneralLedgerSheetQuery
  ): Promise<{
    data: any;
    query: IGeneralLedgerSheetQuery;
    meta: IGeneralLedgerMeta
  }> {
    const {
      accountRepository,
      transactionsRepository,
      contactRepository
    } = this.tenancy.repositories(tenantId);

    const i18n = this.tenancy.i18n(tenantId);

    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    // Retrieve all accounts with associated type from the storage.
    const accounts = await accountRepository.all();
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve all contacts on the storage.
    const contacts = await contactRepository.all();
    const contactsByIdMap = transformToMap(contacts, 'id');

    // Retreive journal transactions from/to the given date.
    const transactions = await transactionsRepository.journal({
      fromDate: filter.fromDate,
      toDate: filter.toDate,
      branchesIds: filter.branchesIds
    });
    // Retreive opening balance credit/debit sumation.
    const openingBalanceTrans = await transactionsRepository.journal({
      toDate: moment(filter.fromDate).subtract(1, 'day'),
      sumationCreditDebit: true,
      branchesIds: filter.branchesIds
    });
    // Transform array transactions to journal collection.
    const transactionsJournal = Journal.fromTransactions(
      transactions,
      tenantId,
      accountsGraph
    );
    // Accounts opening transactions. 
    const openingTransJournal = Journal.fromTransactions(
      openingBalanceTrans,
      tenantId,
      accountsGraph
    );
    // General ledger report instance.
    const generalLedgerInstance = new GeneralLedgerSheet(
      tenantId,
      filter,
      accounts,
      contactsByIdMap,
      transactionsJournal,
      openingTransJournal,
      tenant.metadata.baseCurrency,
      i18n
    );
    // Retrieve general ledger report data.
    const reportData = generalLedgerInstance.reportData();

    return {
      data: reportData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
