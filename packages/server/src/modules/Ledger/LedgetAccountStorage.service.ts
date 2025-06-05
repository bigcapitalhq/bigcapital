import * as async from 'async';
import { Knex } from 'knex';
import { uniq } from 'lodash';
import {
  ILedger,
  ISaveAccountsBalanceQueuePayload,
} from './types/Ledger.types';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../Accounts/models/Account.model';
import { AccountRepository } from '../Accounts/repositories/Account.repository';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class LedegrAccountsStorage {
  /**
   * @param {typeof Account} accountModel
   * @param {AccountRepository} accountRepository -
   */
  constructor(
    private tenancyContext: TenancyContext,
    private accountRepository: AccountRepository,

    @Inject(Account.name)
    private accountModel: TenantModelProxy<typeof Account>,
  ) {}

  /**
   * Retrieve depepants ids of the give accounts ids.
   * @param {number[]} accountsIds
   * @param depGraph
   * @returns {number[]}
   */
  private getDependantsAccountsIds = (
    accountsIds: number[],
    depGraph,
  ): number[] => {
    const depAccountsIds = [];

    accountsIds.forEach((accountId: number) => {
      const depAccountIds = depGraph.dependantsOf(accountId);
      depAccountsIds.push(accountId, ...depAccountIds);
    });
    return uniq(depAccountsIds);
  };

  /**
   * Finds the dependant accounts ids.
   * @param {number[]} accountsIds
   * @returns {number[]}
   */
  private findDependantsAccountsIds = async (
    accountsIds: number[],
    trx?: Knex.Transaction,
  ): Promise<number[]> => {
    const accountsGraph = await this.accountRepository.getDependencyGraph(
      null,
      trx,
    );
    return this.getDependantsAccountsIds(accountsIds, accountsGraph);
  };

  /**
   * Atomic mutation for accounts balances.
   * @param {number} tenantId
   * @param {ILedger} ledger
   * @param {Knex.Transaction} trx -
   * @returns {Promise<void>}
   */
  public saveAccountsBalance = async (
    ledger: ILedger,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Initiate a new queue for accounts balance mutation.
    const saveAccountsBalanceQueue = async.queue(
      this.saveAccountBalanceTask,
      10,
    );
    const effectedAccountsIds = ledger.getAccountsIds();
    const dependAccountsIds = await this.findDependantsAccountsIds(
      effectedAccountsIds,
      trx,
    );
    dependAccountsIds.forEach((accountId: number) => {
      saveAccountsBalanceQueue.push({ ledger, accountId, trx });
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
    task: ISaveAccountsBalanceQueuePayload,
  ): Promise<void> => {
    const { ledger, accountId, trx } = task;

    await this.saveAccountBalanceFromLedger(ledger, accountId, trx);
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
    ledger: ILedger,
    accountId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const account = await this.accountModel().query(trx).findById(accountId);

    // Filters the ledger entries by the current account.
    const accountLedger = ledger.whereAccountId(accountId);

    // Retrieves the given tenant metadata.
    const tenant = await this.tenancyContext.getTenant(true);

    // Detarmines whether the account has foreign currency.
    const isAccountForeign =
      account.currencyCode !== tenant.metadata?.baseCurrency;

    // Calculates the closing foreign balance by the given currency if account was has
    // foreign currency otherwise get closing balance.
    const closingBalance = isAccountForeign
      ? accountLedger
          .whereCurrencyCode(account.currencyCode)
          .getForeignClosingBalance()
      : accountLedger.getClosingBalance();

    await this.saveAccountBalance(accountId, closingBalance, trx);
  };

  /**
   * Saves the account balance.
   * @param {number} accountId
   * @param {number} change
   * @param {Knex.Transaction} trx -
   * @returns {Promise<void>}
   */
  private saveAccountBalance = async (
    accountId: number,
    change: number,
    trx?: Knex.Transaction,
  ) => {
    // Ensure the account has atleast zero in amount.
    await this.accountModel()
      .query(trx)
      .findById(accountId)
      .whereNull('amount')
      .patch({ amount: 0 });

    // await this.accountModel.changeAmount(
    //   { id: accountId },
    //   'amount',
    //   change,
    //   trx,
    // );
  };
}
