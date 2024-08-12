import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import bluebird from 'bluebird';
import { entries, groupBy } from 'lodash';
import {
  AccountBase as PlaidAccountBase,
  Item as PlaidItem,
  Institution as PlaidInstitution,
} from 'plaid';
import { CreateAccount } from '@/services/Accounts/CreateAccount';
import {
  IAccountCreateDTO,
  IPlaidTransactionsSyncedEventPayload,
  PlaidAccount,
  PlaidTransaction,
} from '@/interfaces';
import {
  transformPlaidAccountToCreateAccount,
  transformPlaidTrxsToCashflowCreate,
} from './utils';
import { DeleteCashflowTransaction } from '@/services/Cashflow/DeleteCashflowTransactionService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CashflowApplication } from '@/services/Cashflow/CashflowApplication';
import { Knex } from 'knex';
import uniqid from 'uniqid';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { RemovePendingUncategorizedTransaction } from '@/services/Cashflow/RemovePendingUncategorizedTransaction';

const CONCURRENCY_ASYNC = 10;

@Service()
export class PlaidSyncDb {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private createAccountService: CreateAccount;

  @Inject()
  private cashflowApp: CashflowApplication;

  @Inject()
  private removePendingTransaction: RemovePendingUncategorizedTransaction;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Syncs the Plaid bank account.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createBankAccountDTO
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public async syncBankAccount(
    tenantId: number,
    createBankAccountDTO: IAccountCreateDTO,
    trx?: Knex.Transaction
  ) {
    const { Account } = this.tenancy.models(tenantId);

    const plaidAccount = await Account.query().findOne(
      'plaidAccountId',
      createBankAccountDTO.plaidAccountId
    );
    // Can't continue if the Plaid account is already created.
    if (plaidAccount) {
      return;
    }
    await this.createAccountService.createAccount(
      tenantId,
      createBankAccountDTO,
      trx,
      { ignoreUniqueName: true }
    );
  }

  /**
   * Syncs the plaid accounts to the system accounts.
   * @param {number} tenantId Tenant ID.
   * @param {PlaidAccount[]} plaidAccounts
   * @returns {Promise<void>}
   */
  public async syncBankAccounts(
    tenantId: number,
    plaidAccounts: PlaidAccountBase[],
    institution: PlaidInstitution,
    item: PlaidItem,
    trx?: Knex.Transaction
  ): Promise<void> {
    const transformToPlaidAccounts = transformPlaidAccountToCreateAccount(
      item,
      institution
    );
    const accountCreateDTOs = R.map(transformToPlaidAccounts)(plaidAccounts);

    await bluebird.map(
      accountCreateDTOs,
      (createAccountDTO: any) =>
        this.syncBankAccount(tenantId, createAccountDTO, trx),
      { concurrency: CONCURRENCY_ASYNC }
    );
  }

  /**
   * Synsc the Plaid transactions to the system GL entries.
   * @param {number} tenantId - Tenant ID.
   * @param {number} plaidAccountId - Plaid account ID.
   * @param {PlaidTransaction[]} plaidTranasctions - Plaid transactions
   * @return {Promise<void>}
   */
  public async syncAccountTranactions(
    tenantId: number,
    plaidAccountId: number,
    plaidTranasctions: PlaidTransaction[],
    trx?: Knex.Transaction
  ): Promise<void> {
    const { Account } = this.tenancy.models(tenantId);

    const batch = uniqid();
    const cashflowAccount = await Account.query(trx)
      .findOne({ plaidAccountId })
      .throwIfNotFound();

    // Transformes the Plaid transactions to cashflow create DTOs.
    const transformTransaction = transformPlaidTrxsToCashflowCreate(
      cashflowAccount.id
    );
    const uncategorizedTransDTOs =
      R.map(transformTransaction)(plaidTranasctions);

    // Creating account transaction queue.
    await bluebird.map(
      uncategorizedTransDTOs,
      (uncategoriedDTO) =>
        this.cashflowApp.createUncategorizedTransaction(
          tenantId,
          { ...uncategoriedDTO, batch },
          trx
        ),
      { concurrency: 1 }
    );
    // Triggers `onPlaidTransactionsSynced` event.
    await this.eventPublisher.emitAsync(events.plaid.onTransactionsSynced, {
      tenantId,
      plaidAccountId,
      batch,
    } as IPlaidTransactionsSyncedEventPayload);
  }

  /**
   * Syncs the accounts transactions in paraller under controlled concurrency.
   * @param {number} tenantId
   * @param {PlaidTransaction[]} plaidTransactions
   * @return {Promise<void>}
   */
  public async syncAccountsTransactions(
    tenantId: number,
    plaidAccountsTransactions: PlaidTransaction[],
    trx?: Knex.Transaction
  ): Promise<void> {
    const groupedTrnsxByAccountId = entries(
      groupBy(plaidAccountsTransactions, 'account_id')
    );
    await bluebird.map(
      groupedTrnsxByAccountId,
      ([plaidAccountId, plaidTransactions]: [number, PlaidTransaction[]]) => {
        return this.syncAccountTranactions(
          tenantId,
          plaidAccountId,
          plaidTransactions,
          trx
        );
      },
      { concurrency: CONCURRENCY_ASYNC }
    );
  }

  /**
   * Syncs the removed Plaid transactions ids from the cashflow system transactions.
   * @param {string[]} plaidTransactionsIds - Plaid Transactions IDs.
   */
  public async syncRemoveTransactions(
    tenantId: number,
    plaidTransactionsIds: string[],
    trx?: Knex.Transaction
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const uncategorizedTransactions =
      await UncategorizedCashflowTransaction.query(trx).whereIn(
        'plaidTransactionId',
        plaidTransactionsIds
      );
    const uncategorizedTransactionsIds = uncategorizedTransactions.map(
      (trans) => trans.id
    );
    await bluebird.map(
      uncategorizedTransactionsIds,
      (uncategorizedTransactionId: number) =>
        this.removePendingTransaction.removePendingTransaction(
          tenantId,
          uncategorizedTransactionId,
          trx
        ),
      { concurrency: CONCURRENCY_ASYNC }
    );
  }

  /**
   * Syncs the Plaid item last transaction cursor.
   * @param {number} tenantId - Tenant ID.
   * @param {string} itemId - Plaid item ID.
   * @param {string} lastCursor - Last transaction cursor.
   * @return {Promise<void>}
   */
  public async syncTransactionsCursor(
    tenantId: number,
    plaidItemId: string,
    lastCursor: string,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { PlaidItem } = this.tenancy.models(tenantId);

    await PlaidItem.query(trx).findOne({ plaidItemId }).patch({ lastCursor });
  }

  /**
   * Updates the last feeds updated at of the given Plaid accounts ids.
   * @param {number} tenantId
   * @param {string[]} plaidAccountIds
   * @return {Promise<void>}
   */
  public async updateLastFeedsUpdatedAt(
    tenantId: number,
    plaidAccountIds: string[],
    trx?: Knex.Transaction
  ): Promise<void> {
    const { Account } = this.tenancy.models(tenantId);

    await Account.query(trx)
      .whereIn('plaid_account_id', plaidAccountIds)
      .patch({
        lastFeedsUpdatedAt: new Date(),
      });
  }

  /**
   * Updates the accounts feed active status of the given Plaid accounts ids.
   * @param {number} tenantId
   * @param {number[]} plaidAccountIds
   * @param {boolean} isFeedsActive
   * @returns {Promise<void>}
   */
  public async updateAccountsFeedsActive(
    tenantId: number,
    plaidAccountIds: string[],
    isFeedsActive: boolean = true,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { Account } = this.tenancy.models(tenantId);

    await Account.query(trx)
      .whereIn('plaid_account_id', plaidAccountIds)
      .patch({
        isFeedsActive,
      });
  }
}
