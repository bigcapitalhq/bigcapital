import { Service, Inject } from 'typedi';
import moment from 'moment';
import { IJournalReportQuery, IJournalSheetMeta } from 'interfaces';

import JournalSheet from './JournalSheet';
import TenancyService from 'services/Tenancy/TenancyService';
import Journal from 'services/Accounting/JournalPoster';
import InventoryService from 'services/Inventory/Inventory';
import { parseBoolean, transformToMap } from 'utils';

@Service()
export default class JournalSheetService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  inventoryService: InventoryService;

  @Inject('logger')
  logger: any;

  /**
   * Default journal sheet filter queyr.
   */
  get defaultQuery() {
    return {
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
      fromRange: null,
      toRange: null,
      accountsIds: [],
      transactionTypes: [],
      numberFormat: {
        noCents: false,
        divideOn1000: false,
      },
    };
  }

  /**
   * Retrieve the balance sheet meta.
   * @param {number} tenantId - 
   * @returns {IBalanceSheetMeta}
   */
   reportMetadata(tenantId: number): IJournalSheetMeta {
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
   * Journal sheet.
   * @param {number} tenantId
   * @param {IJournalSheetFilterQuery} query
   */
  async journalSheet(tenantId: number, query: IJournalReportQuery) {
    const {
      accountRepository,
      transactionsRepository,
      contactRepository,
    } = this.tenancy.repositories(tenantId);

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[journal] trying to calculate the report.', {
      tenantId,
      filter,
    });
    // Settings service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });
    // Retrieve all accounts on the storage.
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve all contacts on the storage.
    const contacts = await contactRepository.all();
    const contactsByIdMap = transformToMap(contacts, 'id');

    // Retrieve all journal transactions based on the given query.
    const transactions = await transactionsRepository.journal({
      fromDate: filter.fromDate,
      toDate: filter.toDate,
      transactionsTypes: filter.transactionTypes,
      fromAmount: filter.fromRange,
      toAmount: filter.toRange,
    });
    // Transform the transactions array to journal collection.
    const transactionsJournal = Journal.fromTransactions(
      transactions,
      tenantId,
      accountsGraph
    );
    // Journal report instance.
    const journalSheetInstance = new JournalSheet(
      tenantId,
      filter,
      transactionsJournal,
      accountsGraph,
      contactsByIdMap,
      baseCurrency
    );
    // Retrieve journal report columns.
    const journalSheetData = journalSheetInstance.reportData();

    return {
      data: journalSheetData,
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
