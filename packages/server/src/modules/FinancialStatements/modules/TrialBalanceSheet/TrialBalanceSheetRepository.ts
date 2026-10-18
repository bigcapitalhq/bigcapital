import { isEmpty } from 'lodash';
import { ModelObject } from 'objection';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ITrialBalanceSheetQuery } from './TrialBalanceSheet.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { AccountRepository } from '@/modules/Accounts/repositories/Account.repository';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { LedgerBasis } from '@/modules/Ledger/types/Ledger.types';
import { AccountingBasisService } from '../../common/AccountingBasisService';

@Injectable({ scope: Scope.TRANSIENT })
export class TrialBalanceSheetRepository {
  private query: ITrialBalanceSheetQuery;

  @Inject(Account.name)
  private accountModel: TenantModelProxy<typeof Account>;

  @Inject(AccountTransaction.name)
  private accountTransactionModel: TenantModelProxy<typeof AccountTransaction>;

  @Inject(AccountRepository)
  private accountRepository: AccountRepository;

  @Inject(AccountingBasisService)
  private accountingBasisService: AccountingBasisService;

  /**
   * The report accounting basis.
   */
  public basis: LedgerBasis;

  public accountsDepGraph: any;
  public accounts: Array<ModelObject<Account>>;

  /**
   * Total closing accounts ledger.
   * @param {Ledger}
   */
  public totalAccountsLedger: Ledger;

  /**
   * Set query.
   * @param {ITrialBalanceSheetQuery} query
   */
  public setQuery(query: ITrialBalanceSheetQuery) {
    this.query = query;
  }

  /**
   * Async initialize.
   * @returns {Promise<void>}
   */
  public asyncInitialize = async () => {
    await this.initBasis();
    await this.initAccounts();
    await this.initAccountsClosingTotalLedger();
  };

  /**
   * Initialize the report accounting basis.
   */
  public initBasis = async () => {
    this.basis = await this.accountingBasisService.resolve(this.query.basis);
  };

  // ----------------------------
  // # Accounts
  // ----------------------------
  /**
   * Initialize accounts.
   * @returns {Promise<void>}
   */
  public initAccounts = async () => {
    const accounts = await this.getAccounts();
    const accountsDepGraph = await this.accountRepository.getDependencyGraph();

    this.accountsDepGraph = accountsDepGraph;
    this.accounts = accounts;
  };

  /**
   * Initialize all accounts closing total ledger.
   * @return {Promise<void>}
   */
  public initAccountsClosingTotalLedger = async (): Promise<void> => {
    const totalByAccounts = await this.closingAccountsTotal(this.query.toDate);

    this.totalAccountsLedger = Ledger.fromTransactions(totalByAccounts);
  };

  /**
   * Retrieve accounts of the report.
   * @return {Promise<IAccount[]>}
   */
  private getAccounts = () => {
    return this.accountModel().query();
  };

  /**
   * Retrieve the opening balance transactions of the report.
   * @param {Date|string} openingDate -
   */
  public closingAccountsTotal = async (openingDate: Date | string) => {
    return this.accountTransactionModel()
      .query()
      .onBuild((query) => {
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.groupBy('accountId');
        query.select(['accountId']);

        query.modify('filterDateRange', null, openingDate);
        query.withGraphFetched('account');

        this.commonFilterBranchesQuery(query);
        query.modify('filterByBasis', this.basis);
      });
  };

  /**
   * Common branches filter query.
   * @param {Knex.QueryBuilder} query
   */
  private commonFilterBranchesQuery = (query) => {
    if (!isEmpty(this.query.branchesIds)) {
      query.modify('filterByBranches', this.query.branchesIds);
    }
  };
}
