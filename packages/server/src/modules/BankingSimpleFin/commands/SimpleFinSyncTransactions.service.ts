import * as bluebird from 'bluebird';
import * as moment from 'moment';
import * as uniqid from 'uniqid';
import { Knex } from 'knex';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateUncategorizedTransactionService } from '@/modules/BankingCategorize/commands/CreateUncategorizedTransaction.service';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { SimpleFinClient } from '../SimpleFinClient.service';
import { SimpleFinItem } from '../models/SimpleFinItem';
import {
  parseSimpleFinAmount,
  transformSimpleFinTrxToCashflowCreate,
} from '../utils';
import {
  ISimpleFinTransactionsSyncedEventPayload,
  SimpleFinAccount,
  SimpleFinSyncResult,
} from '../types/BankingSimpleFin.types';

@Injectable()
export class SimpleFinSyncTransactionsService {
  private readonly logger = new Logger(SimpleFinSyncTransactionsService.name);

  constructor(
    private readonly uow: UnitOfWork,
    private readonly configService: ConfigService,
    private readonly eventPublisher: EventEmitter2,
    private readonly simplefinClient: SimpleFinClient,
    private readonly createUncategorizedTransaction: CreateUncategorizedTransactionService,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(SimpleFinItem.name)
    private readonly simplefinItemModel: TenantModelProxy<typeof SimpleFinItem>,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) {}

  /**
   * Determines whether the given item is due for a scheduled sync.
   * @param {SimpleFinItem} item
   * @returns {boolean}
   */
  public isSyncDue(item: SimpleFinItem): boolean {
    if (!item.lastSyncedAt) return true;

    const intervalHours = this.configService.get<number>(
      'simplefin.syncIntervalHours',
    );
    return moment(item.lastSyncedAt)
      .add(intervalHours, 'hours')
      .isSameOrBefore(moment());
  }

  /**
   * Syncs the transactions and balances of the given SimpleFIN item under UOW.
   * @param {string} simplefinItemId - The SimpleFIN item id.
   * @param {boolean} force - Sync even when the scheduled interval has not elapsed.
   * @returns {Promise<SimpleFinSyncResult>}
   */
  public syncItem(
    simplefinItemId: string,
    force: boolean = false,
  ): Promise<SimpleFinSyncResult> {
    return this.uow.withTransaction((trx: Knex.Transaction) =>
      this.syncItemWork(simplefinItemId, force, trx),
    );
  }

  /**
   * Syncs the SimpleFIN item:
   *  - Pulls transactions since the last sync (with an overlap window).
   *  - Creates uncategorized transactions for the ones not imported yet.
   *  - Refreshes the bank balance, feeds flags and last synced timestamps.
   * @param {string} simplefinItemId
   * @param {boolean} force
   * @param {Knex.Transaction} trx
   * @returns {Promise<SimpleFinSyncResult>}
   */
  public async syncItemWork(
    simplefinItemId: string,
    force: boolean,
    trx: Knex.Transaction,
  ): Promise<SimpleFinSyncResult> {
    // Lock the item row to serialize concurrent syncs (manual refresh vs. job).
    const item = await this.simplefinItemModel()
      .query(trx)
      .findOne({ simplefinItemId })
      .forUpdate();

    if (!item || item.isPaused || (!force && !this.isSyncDue(item))) {
      return { addedCount: 0, skipped: true };
    }
    const linkedAccounts = await this.accountModel()
      .query(trx)
      .where({ simplefinItemId })
      .whereNotNull('simplefinAccountId');

    if (linkedAccounts.length === 0) {
      return { addedCount: 0, skipped: true };
    }
    const startDate = this.getSyncStartDate(item);

    const accountSet = await this.simplefinClient.getAccounts(item.accessUrl, {
      startDate,
      accountIds: linkedAccounts.map((a) => a.simplefinAccountId),
    });
    accountSet.errors.forEach((message) =>
      this.logger.warn(`SimpleFIN item ${simplefinItemId}: ${message}`),
    );
    const sfAccountsById = new Map(accountSet.accounts.map((a) => [a.id, a]));

    const counts = await bluebird.mapSeries(linkedAccounts, (account) => {
      const sfAccount = sfAccountsById.get(account.simplefinAccountId);
      if (!sfAccount) {
        this.logger.warn(
          `SimpleFIN account ${account.simplefinAccountId} was not returned for item ${simplefinItemId}.`,
        );
        return 0;
      }
      return this.syncAccount(account, sfAccount, trx);
    });
    const now = new Date();

    await this.simplefinItemModel()
      .query(trx)
      .findById(item.id)
      .patch({ lastSyncedAt: now });

    return {
      addedCount: counts.reduce((sum, count) => sum + count, 0),
      skipped: false,
    };
  }

  /**
   * Syncs a single linked account: imports new transactions and refreshes
   * the balance/feeds metadata.
   * @returns {Promise<number>} The number of imported transactions.
   */
  private async syncAccount(
    account: Account,
    sfAccount: SimpleFinAccount,
    trx: Knex.Transaction,
  ): Promise<number> {
    // Pending transactions are not requested, but filter defensively since
    // their ids are not stable once they post.
    const transactions = (sfAccount.transactions || []).filter(
      (t) => !t.pending,
    );
    const transactionIds = transactions.map((t) => t.id);

    const existing = transactionIds.length
      ? await this.uncategorizedBankTransactionModel()
          .query(trx)
          .where({ accountId: account.id })
          .whereIn('simplefinTransactionId', transactionIds)
          .select('simplefinTransactionId')
      : [];
    const existingIds = new Set(existing.map((e) => e.simplefinTransactionId));

    const newTransactions = transactions.filter((t) => !existingIds.has(t.id));

    if (newTransactions.length > 0) {
      const batch = uniqid();

      await bluebird.mapSeries(newTransactions, (transaction) =>
        this.createUncategorizedTransaction.create(
          {
            ...transformSimpleFinTrxToCashflowCreate(
              account.id,
              account.currencyCode,
              transaction,
            ),
            batch,
          },
          trx,
        ),
      );
      // Triggers `onSimpleFinTransactionsSynced` event.
      await this.eventPublisher.emitAsync(
        events.simplefin.onTransactionsSynced,
        {
          accountId: account.id,
          simplefinAccountId: sfAccount.id,
          batch,
          trx,
        } as ISimpleFinTransactionsSyncedEventPayload,
      );
    }
    await this.accountModel()
      .query(trx)
      .findById(account.id)
      .patch({
        bankBalance: parseSimpleFinAmount(sfAccount.balance),
        lastFeedsUpdatedAt: new Date(),
        isFeedsActive: true,
      });

    return newTransactions.length;
  }

  /**
   * Retrieves the start date of the transactions window to request.
   * @param {SimpleFinItem} item
   * @returns {Date}
   */
  private getSyncStartDate(item: SimpleFinItem): Date {
    if (item.lastSyncedAt) {
      const overlapDays = this.configService.get<number>(
        'simplefin.syncOverlapDays',
      );
      return moment(item.lastSyncedAt).subtract(overlapDays, 'days').toDate();
    }
    const initialDays = this.configService.get<number>(
      'simplefin.initialSyncDays',
    );
    // Today plus the previous (initialDays - 1) full days, so the window
    // never exceeds `initialDays` calendar days (SimpleFIN Bridge caps the
    // requested range at 90 days and warns when it is exceeded).
    return moment()
      .subtract(Math.max(initialDays - 1, 0), 'days')
      .startOf('day')
      .toDate();
  }
}
