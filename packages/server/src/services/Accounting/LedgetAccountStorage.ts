import { Service, Inject } from 'typedi';
import async from 'async';
import { Knex } from 'knex';
import { uniq } from 'lodash';
import { ILedger, ISaveAccountsBalanceQueuePayload } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TenantMetadata } from '@/system/models';

@Service()
export class LedgerAccountsStorage {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve dependents ids of the give accounts ids.
   * @param   {number[]} accountsIds
   * @param   depGraph
   * @returns {number[]}
   */
  private getDependantsAccountsIds = (
    accountsIds: number[],
    depGraph
  ): number[] => {
    const depAccountsIds = [];

    accountsIds.forEach((accountId: number) => {
      const depAccountIds = depGraph.dependantsOf(accountId);
      depAccountsIds.push(accountId, ...depAccountIds);
    });
    return uniq(depAccountsIds);
  };

  /**
   *
   * @param   {number} tenantId
   * @param   {number[]} accountsIds
   * @returns {number[]}
   */
  private findDependantsAccountsIds = async (
    tenantId: number,
    accountsIds: number[],
    trx?: Knex.Transaction
  ): Promise<number[]> => {
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const accountsGraph = await accountRepository.getDependencyGraph(null, trx);

    return this.getDependantsAccountsIds(accountsIds, accountsGraph);
  };

  /**
   * Atomic mutation for accounts balances.
   * @param   {number} tenantId
   * @param   {ILedger} ledger
   * @param   {Knex.Transaction} trx -
   * @returns {Promise<void>}
   */
  public saveAccountsBalance = async (
    tenantId: number,
    ledger: ILedger,
    trx?: Knex.Transaction
  ): Promise<void> => {
    // Initiate a new queue for accounts balance mutation.
    const saveAccountsBalanceQueue = async.queue(
      this.saveAccountBalanceTask,
      10
    );
    const effectedAccountsIds = ledger.getAccountsIds();
    const dependAccountsIds = await this.findDependantsAccountsIds(
      tenantId,
      effectedAccountsIds,
      trx
    );
    dependAccountsIds.forEach((accountId: number) => {
      saveAccountsBalanceQueue.push({ tenantId, ledger, accountId, trx });
    });
    if (dependAccountsIds.length > 0) {
      await saveAccountsBalanceQueue.drain();
    }
  };

  /**
   * Async task mutates the given account balance.
   * @param   {ISaveAccountsBalanceQueuePayload} task
   * @returns {Promise<void>}
   */
  private saveAccountBalanceTask = async (
    task: ISaveAccountsBalanceQueuePayload
  ): Promise<void> => {
    const { tenantId, ledger, accountId, trx } = task;

    await this.saveAccountBalanceFromLedger(tenantId, ledger, accountId, trx);
  };

  /**
   * Saves specific account balance from the given ledger.
   * @param   {number} tenantId
   * @param   {ILedger} ledger
   * @param   {number} accountId
   * @param   {Knex.Transaction} trx -
   * @returns {Promise<void>}
   */
  private saveAccountBalanceFromLedger = async (
    tenantId: number,
    ledger: ILedger,
    accountId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { Account } = this.tenancy.models(tenantId);
    const account = await Account.query(trx).findById(accountId);

    // Filters the ledger entries by the current account.
    const accountLedger = ledger.whereAccountId(accountId);

    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Determines whether the account has foreign currency.
    const isAccountForeign = account.currencyCode !== tenantMeta.baseCurrency;

    // Calculates the closing foreign balance by the given currency if account was has
    // foreign currency otherwise get closing balance.
    const closingBalance = isAccountForeign
      ? accountLedger
          .whereCurrencyCode(account.currencyCode)
          .getForeignClosingBalance()
      : accountLedger.getClosingBalance();

    await this.saveAccountBalance(tenantId, accountId, closingBalance, trx);
  };

  /**
   * Saves the account balance.
   * @param   {number} tenantId
   * @param   {number} accountId
   * @param   {number} change
   * @param   {Knex.Transaction} trx -
   * @returns {Promise<void>}
   */
  private saveAccountBalance = async (
    tenantId: number,
    accountId: number,
    change: number,
    trx?: Knex.Transaction
  ) => {
    const { Account } = this.tenancy.models(tenantId);

    // Ensure the account has atleast zero in amount.
    await Account.query(trx)
      .findById(accountId)
      .whereNull('amount')
      .patch({ amount: 0 });

    await Account.changeAmount({ id: accountId }, 'amount', change, trx);
  };
}
