import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import async from 'async';
import { forOwn, groupBy } from 'lodash';
import { CreateAccount } from '@/services/Accounts/CreateAccount';
import {
  PlaidAccount,
  PlaidTransaction,
  SyncAccountsTransactionsTask,
} from './_types';
import {
  transformPlaidAccountToCreateAccount,
  transformPlaidTrxsToCashflowCreate,
} from './utils';
import NewCashflowTransactionService from '@/services/Cashflow/NewCashflowTransactionService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ICashflowNewCommandDTO } from '@/interfaces';

@Service()
export class PlaidSyncDb {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private createAccountService: CreateAccount;

  @Inject()
  private createCashflowTransactionService: NewCashflowTransactionService;

  /**
   * Syncs the plaid accounts to the system accounts.
   * @param {number} tenantId Tenant ID.
   * @param {PlaidAccount[]} plaidAccounts
   */
  public syncBankAccounts(tenantId: number, plaidAccounts: PlaidAccount[]) {
    const accountCreateDTOs = R.map(transformPlaidAccountToCreateAccount)(
      plaidAccounts
    );
    accountCreateDTOs.map((createDTO) => {
      return this.createAccountService.createAccount(tenantId, createDTO);
    });
  }

  /**
   * Synsc the Plaid transactions to the system GL entries.
   * @param {number} tenantId - Tenant ID.
   * @param {number} plaidAccountId - Plaid account ID.
   * @param {PlaidTransaction[]} plaidTranasctions - Plaid transactions
   */
  public async syncAccountTranactions(
    tenantId: number,
    plaidAccountId: number,
    plaidTranasctions: PlaidTransaction[]
  ): Promise<void> {
    const { Account } = await this.tenancy.models(tenantId);

    const cashflowAccount = await Account.query()
      .findOne('plaidAccountId', plaidAccountId)
      .throwIfNotFound();

    const openingEquityBalance = await Account.query().findOne(
      'slug',
      'opening-balance-equity'
    );
    // Transformes the Plaid transactions to cashflow create DTOs.
    const transformTransaction = transformPlaidTrxsToCashflowCreate(
      cashflowAccount.id,
      openingEquityBalance.id
    );
    const accountsCashflowDTO = R.map(transformTransaction)(plaidTranasctions);

    // Creating account transaction queue.
    const createAccountTransactionsQueue = async.queue(
      (cashflowDTO: ICashflowNewCommandDTO) =>
        this.createCashflowTransactionService.newCashflowTransaction(
          tenantId,
          cashflowDTO
        ),
      10
    );
    accountsCashflowDTO.forEach((cashflowDTO) => {
      createAccountTransactionsQueue.push(cashflowDTO);
    });
    await createAccountTransactionsQueue.drain();
  }

  /**
   * Syncs the accounts transactions in paraller under controlled concurrency.
   * @param {number} tenantId
   * @param {PlaidTransaction[]} plaidTransactions
   */
  public async syncAccountsTransactions(
    tenantId: number,
    plaidAccountsTransactions: PlaidTransaction[]
  ): Promise<void> {
    const groupedTrnsxByAccountId = groupBy(
      plaidAccountsTransactions,
      'account_id'
    );
    const syncAccountsTrnsx = async.queue(
      ({
        tenantId,
        plaidAccountId,
        plaidTransactions,
      }: SyncAccountsTransactionsTask) => {
        return this.syncAccountTranactions(
          tenantId,
          plaidAccountId,
          plaidTransactions
        );
      },
      2
    );
    forOwn(groupedTrnsxByAccountId, (plaidTransactions, plaidAccountId) => {
      syncAccountsTrnsx.push({ tenantId, plaidAccountId, plaidTransactions });
    });
    await syncAccountsTrnsx.drain();
  }

  /**
   * Syncs the Plaid item last transaction cursor.
   * @param {number} tenantId -
   * @param {string} itemId -
   * @param {string} lastCursor -
   */
  public async syncTransactionsCursor(
    tenantId: number,
    plaidItemId: string,
    lastCursor: string
  ) {
    const { PlaidItem } = this.tenancy.models(tenantId);

    await PlaidItem.query().findById(plaidItemId).patch({ lastCursor });
  }
}
