import { Service, Inject } from 'typedi';
import moment from 'moment';
import { IJournalReportQuery, IJournalSheet } from '@/interfaces';
import JournalSheet from './JournalSheet';
import TenancyService from '@/services/Tenancy/TenancyService';
import Journal from '@/services/Accounting/JournalPoster';
import { Tenant } from '@/system/models';
import { transformToMap } from 'utils';
import { JournalSheetMeta } from './JournalSheetMeta';

@Service()
export class JournalSheetService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private journalSheetMeta: JournalSheetMeta;

  /**
   * Default journal sheet filter queyr.
   */
  get defaultQuery() {
    return {
      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
      fromRange: null,
      toRange: null,
      accountsIds: [],
      numberFormat: {
        noCents: false,
        divideOn1000: false,
      },
    };
  }

  /**
   * Journal sheet.
   * @param {number} tenantId
   * @param {IJournalReportQuery} query
   * @returns {Promise<IJournalSheet>}
   */
  async journalSheet(
    tenantId: number,
    query: IJournalReportQuery
  ): Promise<IJournalSheet> {
    const i18n = this.tenancy.i18n(tenantId);
    const { accountRepository, transactionsRepository, contactRepository } =
      this.tenancy.repositories(tenantId);

    const { AccountTransaction } = this.tenancy.models(tenantId);

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    // Retrieve all accounts on the storage.
    const accountsGraph = await accountRepository.getDependencyGraph();

    // Retrieve all contacts on the storage.
    const contacts = await contactRepository.all();
    const contactsByIdMap = transformToMap(contacts, 'id');

    // Retrieve all journal transactions based on the given query.
    const transactions = await AccountTransaction.query().onBuild((query) => {
      if (filter.fromRange || filter.toRange) {
        query.modify('filterAmountRange', filter.fromRange, filter.toRange);
      }
      query.modify('filterDateRange', filter.fromDate, filter.toDate);
      query.orderBy(['date', 'createdAt', 'indexGroup', 'index']);

      if (filter.transactionType) {
        query.where('reference_type', filter.transactionType);
      }
      if (filter.transactionType && filter.transactionId) {
        query.where('reference_id', filter.transactionId);
      }
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
      tenant.metadata.baseCurrency,
      i18n
    );
    // Retrieve journal report columns.
    const journalSheetData = journalSheetInstance.reportData();

    // Retrieve the journal sheet meta.
    const meta = await this.journalSheetMeta.meta(tenantId, filter);

    return {
      data: journalSheetData,
      query: filter,
      meta,
    };
  }
}
