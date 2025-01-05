import * as R from 'ramda';
import bluebird from 'bluebird';
import { entries, groupBy } from 'lodash';
import {
  AccountBase as PlaidAccountBase,
  Item as PlaidItem,
  Institution as PlaidInstitution,
  Transaction as PlaidTransaction,
} from 'plaid';
import {
  transformPlaidAccountToCreateAccount,
  transformPlaidTrxsToCashflowCreate,
} from '../utils';
import { Knex } from 'knex';
import uniqid from 'uniqid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RemovePendingUncategorizedTransaction } from '../../BankingTransactions/commands/RemovePendingUncategorizedTransaction.service';
import { CreateAccountService } from '../../Accounts/CreateAccount.service';
import { Account } from '../../Accounts/models/Account.model';
import { events } from '@/common/events/events';
import { PlaidItem as PlaidItemModel } from '../models/PlaidItem';
import { IAccountCreateDTO } from '@/interfaces/Account';
import { IPlaidTransactionsSyncedEventPayload } from '../types/BankingPlaid.types';
import { UncategorizedBankTransaction } from '../../BankingTransactions/models/UncategorizedBankTransaction';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUncategorizedTransactionService } from '@/modules/BankingCategorize/commands/CreateUncategorizedTransaction.service';

const CONCURRENCY_ASYNC = 10;

@Injectable()
export class PlaidSyncDb {
  constructor(
    private readonly createAccountService: CreateAccountService,
    private readonly createUncategorizedTransaction: CreateUncategorizedTransactionService,
    private readonly removePendingTransaction: RemovePendingUncategorizedTransaction,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Account.name)
    private readonly accountModel: typeof Account,

    @Inject(PlaidItemModel.name)
    private readonly plaidItemModel: typeof PlaidItemModel,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: typeof UncategorizedBankTransaction,
  ) {}

  /**
   * Syncs the Plaid bank account.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createBankAccountDTO
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public async syncBankAccount(
    createBankAccountDTO: IAccountCreateDTO,
    trx?: Knex.Transaction,
  ) {
    const plaidAccount = await this.accountModel
      .query(trx)
      .findOne('plaidAccountId', createBankAccountDTO.plaidAccountId);
    // Can't continue if the Plaid account is already created.
    if (plaidAccount) {
      return;
    }
    await this.createAccountService.createAccount(createBankAccountDTO, trx, {
      ignoreUniqueName: true,
    });
  }

  /**
   * Syncs the plaid accounts to the system accounts.
   * @param {number} tenantId Tenant ID.
   * @param {PlaidAccount[]} plaidAccounts
   * @returns {Promise<void>}
   */
  public async syncBankAccounts(
    plaidAccounts: PlaidAccountBase[],
    institution: PlaidInstitution,
    item: PlaidItem,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const transformToPlaidAccounts = transformPlaidAccountToCreateAccount(
      item,
      institution,
    );
    const accountCreateDTOs = R.map(transformToPlaidAccounts)(plaidAccounts);

    await bluebird.map(
      accountCreateDTOs,
      (createAccountDTO: any) => this.syncBankAccount(createAccountDTO, trx),
      { concurrency: CONCURRENCY_ASYNC },
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
    plaidAccountId: number,
    plaidTranasctions: PlaidTransaction[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    const batch = uniqid();
    const cashflowAccount = await this.accountModel
      .query(trx)
      .findOne({ plaidAccountId })
      .throwIfNotFound();

    // Transformes the Plaid transactions to cashflow create DTOs.
    const transformTransaction = transformPlaidTrxsToCashflowCreate(
      cashflowAccount.id,
    );
    const uncategorizedTransDTOs =
      R.map(transformTransaction)(plaidTranasctions);

    // Creating account transaction queue.
    await bluebird.map(
      uncategorizedTransDTOs,
      (uncategoriedDTO) =>
        this.createUncategorizedTransaction.create(
          { ...uncategoriedDTO, batch },
          trx,
        ),
      { concurrency: 1 },
    );
    // Triggers `onPlaidTransactionsSynced` event.
    await this.eventPublisher.emitAsync(events.plaid.onTransactionsSynced, {
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
    plaidAccountsTransactions: PlaidTransaction[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    const groupedTrnsxByAccountId = entries(
      groupBy(plaidAccountsTransactions, 'account_id'),
    );
    await bluebird.map(
      groupedTrnsxByAccountId,
      ([plaidAccountId, plaidTransactions]: [number, PlaidTransaction[]]) => {
        return this.syncAccountTranactions(
          plaidAccountId,
          plaidTransactions,
          trx,
        );
      },
      { concurrency: CONCURRENCY_ASYNC },
    );
  }

  /**
   * Syncs the removed Plaid transactions ids from the cashflow system transactions.
   * @param {string[]} plaidTransactionsIds - Plaid Transactions IDs.
   */
  public async syncRemoveTransactions(
    plaidTransactionsIds: string[],
    trx?: Knex.Transaction,
  ) {
    const uncategorizedTransactions =
      await this.uncategorizedBankTransactionModel
        .query(trx)
        .whereIn('plaidTransactionId', plaidTransactionsIds);
    const uncategorizedTransactionsIds = uncategorizedTransactions.map(
      (trans) => trans.id,
    );
    await bluebird.map(
      uncategorizedTransactionsIds,
      (uncategorizedTransactionId: number) =>
        this.removePendingTransaction.removePendingTransaction(
          uncategorizedTransactionId,
          trx,
        ),
      { concurrency: CONCURRENCY_ASYNC },
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
    plaidItemId: string,
    lastCursor: string,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.plaidItemModel
      .query(trx)
      .findOne({ plaidItemId })
      .patch({ lastCursor });
  }

  /**
   * Updates the last feeds updated at of the given Plaid accounts ids.
   * @param {number} tenantId
   * @param {string[]} plaidAccountIds
   * @return {Promise<void>}
   */
  public async updateLastFeedsUpdatedAt(
    plaidAccountIds: string[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.accountModel
      .query(trx)
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
    plaidAccountIds: string[],
    isFeedsActive: boolean = true,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.accountModel
      .query(trx)
      .whereIn('plaid_account_id', plaidAccountIds)
      .patch({
        isFeedsActive,
      });
  }
}
