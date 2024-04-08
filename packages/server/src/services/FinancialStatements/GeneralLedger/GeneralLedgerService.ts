import { ServiceError } from '@/exceptions';
import { IGeneralLedgerMeta, IGeneralLedgerSheetQuery } from '@/interfaces';
import Journal from '@/services/Accounting/JournalPoster';
import GeneralLedgerSheet from '@/services/FinancialStatements/GeneralLedger/GeneralLedger';
import TenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';
import { difference } from 'lodash';
import moment from 'moment';
import { Inject, Service } from 'typedi';
import { transformToMap } from '../../../utils';
import { GeneralLedgerMeta } from './GeneralLedgerMeta';

const ERRORS = {
  ACCOUNTS_NOT_FOUND: 'ACCOUNTS_NOT_FOUND',
};

@Service()
export class GeneralLedgerService {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private generalLedgerMeta: GeneralLedgerMeta;

  /**
   * Defaults general ledger report filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery() {
    return {
      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
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
   * Validates accounts existance on the storage.
   * @param {number} tenantId
   * @param {number[]} accountsIds
   */
  async validateAccountsExistance(tenantId: number, accountsIds: number[]) {
    const { Account } = this.tenancy.models(tenantId);

    const storedAccounts = await Account.query().whereIn('id', accountsIds);
    const storedAccountsIds = storedAccounts.map((a) => a.id);

    if (difference(accountsIds, storedAccountsIds).length > 0) {
      throw new ServiceError(ERRORS.ACCOUNTS_NOT_FOUND);
    }
  }

  /**
   * Retrieve general ledger report statement.
   * @param {number} tenantId
   * @param {IGeneralLedgerSheetQuery} query
   * @return {IGeneralLedgerStatement}
   */
  async generalLedger(
    tenantId: number,
    query: IGeneralLedgerSheetQuery,
  ): Promise<{
    data: any;
    query: IGeneralLedgerSheetQuery;
    meta: IGeneralLedgerMeta;
  }> {
    const { accountRepository, transactionsRepository, contactRepository } = this.tenancy.repositories(tenantId);

    const i18n = this.tenancy.i18n(tenantId);

    const tenant = await Tenant.query().findById(tenantId).withGraphFetched('metadata');

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
      branchesIds: filter.branchesIds,
    });
    // Retreive opening balance credit/debit sumation.
    const openingBalanceTrans = await transactionsRepository.journal({
      toDate: moment(filter.fromDate).subtract(1, 'day'),
      sumationCreditDebit: true,
      branchesIds: filter.branchesIds,
    });
    // Transform array transactions to journal collection.
    const transactionsJournal = Journal.fromTransactions(transactions, tenantId, accountsGraph);
    // Accounts opening transactions.
    const openingTransJournal = Journal.fromTransactions(openingBalanceTrans, tenantId, accountsGraph);
    // General ledger report instance.
    const generalLedgerInstance = new GeneralLedgerSheet(
      tenantId,
      filter,
      accounts,
      contactsByIdMap,
      transactionsJournal,
      openingTransJournal,
      tenant.metadata.baseCurrency,
      i18n,
    );
    // Retrieve general ledger report data.
    const reportData = generalLedgerInstance.reportData();

    // Retrieve general ledger report metadata.
    const meta = await this.generalLedgerMeta.meta(tenantId, filter);

    return {
      data: reportData,
      query: filter,
      meta,
    };
  }
}
