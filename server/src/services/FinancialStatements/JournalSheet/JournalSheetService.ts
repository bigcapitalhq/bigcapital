import { Service, Inject } from "typedi";
import { IJournalReportQuery } from 'interfaces';
import moment from 'moment';
import JournalSheet from "./JournalSheet";
import TenancyService from "services/Tenancy/TenancyService";
import Journal from "services/Accounting/JournalPoster";

@Service()
export default class JournalSheetService  {
  @Inject()
  tenancy: TenancyService;

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
   * Journal sheet.
   * @param {number} tenantId 
   * @param {IJournalSheetFilterQuery} query 
   */
  async journalSheet(
    tenantId: number,
    query: IJournalReportQuery,
  ) {
    const {
      accountRepository,
      transactionsRepository,
    } = this.tenancy.repositories(tenantId);

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    this.logger.info('[journal] trying to calculate the report.', { tenantId, filter });

    // Settings service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({ group: 'organization', key: 'base_currency' });

    // Retrieve all accounts on the storage.
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve all journal transactions based on the given query.
    const transactions = await transactionsRepository.journal({
      fromDate: filter.fromDate,
      toDate: filter.toDate,
      transactionsTypes: filter.transactionTypes,
      fromAmount: filter.fromRange,
      toAmount: filter.toRange,
    });

    // Transform the transactions array to journal collection.
    const transactionsJournal = Journal.fromTransactions(transactions, tenantId, accountsGraph);

    // Journal report instance.
    const journalSheetInstance = new JournalSheet(
      tenantId,
      filter,
      transactionsJournal,
      baseCurrency
    );
    // Retrieve journal report columns.
    const journalSheetData = journalSheetInstance.reportData();

    return journalSheetData;
  }
}