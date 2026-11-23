import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { MatchedBankTransaction } from '@/modules/BankingMatching/models/MatchedBankTransaction';
import { BankReconciliation } from '../models/BankReconciliation';
import { BankReconciliationTransaction } from '../models/BankReconciliationTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { getReconciliationSupport } from '../getReconciliationSupport';
import { ERRORS } from '../constants';
import { ServiceError } from '@/modules/Items/ServiceError';
import {
  BankReconciliationStatus,
  IBankReconciliationTransactionKey,
  IBankReconciliationTransactionRow,
} from '../types/BankingReconciliation.types';
import { isEmpty } from 'lodash';

const DATE_FORMAT = 'YYYY-MM-DD';

const isCashBasis = (builder) => {
  builder.whereNull('basis').orWhere('basis', '!=', 'cash');
};

@Injectable()
export class BankingReconciliationRepository {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @Inject(AccountTransaction.name)
    private readonly accountTransactionModel: TenantModelProxy<
      typeof AccountTransaction
    >,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,

    @Inject(MatchedBankTransaction.name)
    private readonly matchedModel: TenantModelProxy<
      typeof MatchedBankTransaction
    >,

    @Inject(BankReconciliation.name)
    private readonly reconciliationModel: TenantModelProxy<
      typeof BankReconciliation
    >,

    @Inject(BankReconciliationTransaction.name)
    private readonly reconciliationTransactionModel: TenantModelProxy<
      typeof BankReconciliationTransaction
    >,

    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieves the given account or throws.
   */
  public getAccount = async (accountId: number): Promise<Account> => {
    return this.accountModel().query().findById(accountId).throwIfNotFound();
  };

  /**
   * Retrieves the given account and validates it supports reconciliation.
   */
  public getAccountOrThrow = async (accountId: number): Promise<Account> => {
    const account = await this.getAccount(accountId);
    await this.validateAccountSupportsReconciliation(account);
    return account;
  };

  public getAccountSupport = async (account: Account) => {
    const tenant = await this.tenancyContext.getTenant(true);
    return getReconciliationSupport(account, tenant?.metadata?.baseCurrency);
  };

  public validateAccountSupportsReconciliation = async (
    account: Account,
  ): Promise<void> => {
    const support = await this.getAccountSupport(account);
    if (!support.isSupported) {
      throw new ServiceError(support.errorCode, support.unsupportedReason);
    }
  };

  /**
   * Retrieves the reconciliation or throws.
   */
  public getReconciliationOrThrow = async (
    reconciliationId: number,
    trx?: Knex.Transaction,
  ): Promise<BankReconciliation> => {
    const reconciliation = await this.reconciliationModel()
      .query(trx)
      .findById(reconciliationId)
      .withGraphFetched('account')
      .withGraphFetched('transactions.accountTransaction');

    if (!reconciliation) {
      throw new ServiceError(
        ERRORS.BANK_RECONCILIATION_NOT_FOUND,
        'Reconciliation not found.',
      );
    }
    return reconciliation;
  };

  /**
   * Retrieves the current in-progress reconciliation of the account.
   */
  public getInProgressReconciliation = async (
    accountId: number,
  ): Promise<BankReconciliation | undefined> => {
    return this.reconciliationModel()
      .query()
      .where('accountId', accountId)
      .where('status', BankReconciliationStatus.InProgress)
      .first();
  };

  /**
   * Retrieves the latest reconciled reconciliation of the account.
   */
  public getLatestReconciled = async (
    accountId: number,
  ): Promise<BankReconciliation | undefined> => {
    return this.reconciliationModel()
      .query()
      .where('accountId', accountId)
      .where('status', BankReconciliationStatus.Reconciled)
      .orderBy('endDate', 'desc')
      .orderBy('id', 'desc')
      .first();
  };

  /**
   * Retrieves the earliest start date of all non-voided reconciliations.
   */
  public getFirstStartDate = async (
    accountId: number,
    fallbackStartDate: Date | string,
  ): Promise<Date | string> => {
    const reconciliation = await this.reconciliationModel()
      .query()
      .where('accountId', accountId)
      .whereNot('status', BankReconciliationStatus.Voided)
      .orderBy('startDate', 'asc')
      .first();

    return reconciliation?.startDate ?? fallbackStartDate;
  };

  /**
   * Retrieves the date of the first account transaction.
   */
  public getFirstTransactionDate = async (
    accountId: number,
  ): Promise<Date | string | null> => {
    const transaction = await this.accountTransactionModel()
      .query()
      .where('accountId', accountId)
      .where(isCashBasis)
      .orderBy('date', 'asc')
      .first();

    return transaction?.date ?? null;
  };

  /**
   * Retrieves the account balance before the given date.
   */
  public getLedgerBalanceBefore = async (
    accountId: number,
    date: Date | string,
  ): Promise<number> => {
    const result = await this.accountTransactionModel()
      .query()
      .where('accountId', accountId)
      .where('date', '<', moment(date).format(DATE_FORMAT))
      .where(isCashBasis)
      .sum('debit as debit')
      .sum('credit as credit')
      .first();

    return Number(result?.debit ?? 0) - Number(result?.credit ?? 0);
  };

  /**
   * Retrieves the reconciliation keys that have already been completed.
   */
  public getCompletedTransactionKeys = async (
    accountId: number,
    trx?: Knex.Transaction,
  ): Promise<Set<string>> => {
    const rows = await this.reconciliationTransactionModel()
      .query(trx)
      .where('accountId', accountId)
      .select('referenceType', 'referenceId', 'transactionIndex');

    return new Set(
      rows.map((row) =>
        this.buildTransactionKey(
          row.referenceType,
          row.referenceId,
          row.transactionIndex,
        ),
      ),
    );
  };

  /**
   * Builds a stable key for a ledger line.
   */
  public buildTransactionKey = (
    referenceType: string,
    referenceId: number,
    index?: number | null,
  ): string => `${referenceType}:${referenceId}:${Number(index ?? 0)}`;

  /**
   * Transforms a raw account transaction to a reconciliation row.
   */
  private transformRow = (
    transaction: AccountTransaction,
    status: IBankReconciliationTransactionRow['status'],
    isBankFeed: boolean,
    uncategorizedTransactionIds: number[],
    selectedKeys: Set<string>,
    startDate: Date | string,
  ): IBankReconciliationTransactionRow => {
    const index = Number(transaction.index ?? 0);
    const key = this.buildTransactionKey(
      transaction.referenceType,
      transaction.referenceId,
      index,
    );

    return {
      key,
      accountTransactionId: transaction.id,
      referenceType: transaction.referenceType,
      referenceId: transaction.referenceId,
      index,
      date: transaction.date,
      transactionType: transaction.transactionType ?? null,
      transactionNumber: transaction.transactionNumber ?? null,
      referenceNumber: transaction.referenceNumber ?? null,
      note: transaction.note ?? null,
      credit: Number(transaction.credit ?? 0),
      debit: Number(transaction.debit ?? 0),
      currencyCode: transaction.currencyCode ?? null,
      exchangeRate: transaction.exchangeRate ?? null,
      status,
      isBankFeed,
      isPreviousOutstanding:
        moment(transaction.date).format(DATE_FORMAT) <
        moment(startDate).format(DATE_FORMAT),
      isChecked: selectedKeys.has(key),
      isReconciled: false,
      uncategorizedTransactionIds,
    };
  };

  /**
   * Retrieves the bank-feed status maps for the given ledger rows.
   */
  private getBankFeedMaps = async (
    transactions: AccountTransaction[],
  ): Promise<{
    categorized: Map<string, UncategorizedBankTransaction[]>;
    matched: Map<string, MatchedBankTransaction[]>;
  }> => {
    const refs = transactions
      .filter(
        (transaction) => transaction.referenceType && transaction.referenceId,
      )
      .map((transaction) => [
        transaction.referenceType,
        transaction.referenceId,
      ]);

    if (isEmpty(refs)) {
      return { categorized: new Map(), matched: new Map() };
    }

    const [categorizedRows, matchedRows] = await Promise.all([
      this.uncategorizedModel()
        .query()
        .whereIn(['categorizeRefType', 'categorizeRefId'], refs as any),
      this.matchedModel()
        .query()
        .whereIn(['referenceType', 'referenceId'], refs as any),
    ]);

    const categorized = new Map<string, UncategorizedBankTransaction[]>();
    const matched = new Map<string, MatchedBankTransaction[]>();

    categorizedRows.forEach((row) => {
      const ref = `${row.categorizeRefType}:${row.categorizeRefId}`;
      const list = categorized.get(ref) ?? [];
      list.push(row);
      categorized.set(ref, list);
    });
    matchedRows.forEach((row) => {
      const ref = `${row.referenceType}:${row.referenceId}`;
      const list = matched.get(ref) ?? [];
      list.push(row);
      matched.set(ref, list);
    });

    return { categorized, matched };
  };

  /**
   * Retrieves the unreconciled transactions of the account within the period.
   *
   * For the first reconciliation, transactions before the start date are part
   * of the beginning balance and are not listed. For later reconciliations,
   * all still-unreconciled transactions through the end date are listed so that
   * prior-period outstanding items can be cleared.
   */
  public getUnreconciledTransactions = async (params: {
    accountId: number;
    startDate: Date | string;
    endDate: Date | string;
    firstStartDate?: Date | string;
    selectedKeys?: IBankReconciliationTransactionKey[];
  }): Promise<{ rows: IBankReconciliationTransactionRow[] }> => {
    const {
      accountId,
      startDate,
      endDate,
      firstStartDate,
      selectedKeys = [],
    } = params;

    const lowerBound = firstStartDate ?? startDate;
    const selectedKeysSet = new Set(
      selectedKeys.map((key) =>
        this.buildTransactionKey(key.referenceType, key.referenceId, key.index),
      ),
    );

    const [transactions, completedKeys] = await Promise.all([
      this.accountTransactionModel()
        .query()
        .where('accountId', accountId)
        .where('date', '>=', moment(lowerBound).format(DATE_FORMAT))
        .where('date', '<=', moment(endDate).format(DATE_FORMAT))
        .where(isCashBasis)
        .orderBy([
          { column: 'date', order: 'asc' },
          { column: 'id', order: 'asc' },
        ]),
      this.getCompletedTransactionKeys(accountId),
    ]);

    const filteredTransactions = transactions.filter(
      (transaction) =>
        !completedKeys.has(
          this.buildTransactionKey(
            transaction.referenceType,
            transaction.referenceId,
            transaction.index,
          ),
        ),
    );

    const bankFeedMaps = await this.getBankFeedMaps(filteredTransactions);

    const rows = filteredTransactions.map((transaction) => {
      const ref = `${transaction.referenceType}:${transaction.referenceId}`;
      const categorized = bankFeedMaps.categorized.get(ref) ?? [];
      const matched = bankFeedMaps.matched.get(ref) ?? [];
      const isBankFeed = categorized.length > 0 || matched.length > 0;

      const status: IBankReconciliationTransactionRow['status'] =
        categorized.length > 0
          ? 'categorized'
          : matched.length > 0
            ? 'matched'
            : 'manual';

      const uncategorizedTransactionIds = [
        ...categorized.map((row) => row.id),
        ...matched.map((row) => row.uncategorizedTransactionId),
      ].filter((id): id is number => Boolean(id));

      return this.transformRow(
        transaction,
        status,
        isBankFeed,
        Array.from(new Set(uncategorizedTransactionIds)),
        selectedKeysSet,
        startDate,
      );
    });

    return { rows };
  };

  /**
   * Builds the display rows of a reconciled reconciliation from the current
   * journal entries linked to it. The journal entry is always the source of
   * truth; nothing is read from a reconciliation snapshot.
   */
  public getReconciledRows = async (
    reconciliation: BankReconciliation,
  ): Promise<IBankReconciliationTransactionRow[]> => {
    const links = reconciliation.transactions ?? [];
    const transactions = links
      .map((link) => link.accountTransaction)
      .filter(Boolean) as AccountTransaction[];

    const bankFeedMaps = await this.getBankFeedMaps(transactions);
    const noSelectedKeys = new Set<string>();

    const rows = links
      .map((link) => {
        const transaction = link.accountTransaction;

        if (!transaction) {
          return null;
        }
        const ref = `${transaction.referenceType}:${transaction.referenceId}`;
        const categorized = bankFeedMaps.categorized.get(ref) ?? [];
        const matched = bankFeedMaps.matched.get(ref) ?? [];
        const status: IBankReconciliationTransactionRow['status'] =
          categorized.length > 0
            ? 'categorized'
            : matched.length > 0
              ? 'matched'
              : 'manual';

        const uncategorizedTransactionIds = [
          ...categorized.map((row) => row.id),
          ...matched.map((row) => row.uncategorizedTransactionId),
        ].filter((id): id is number => Boolean(id));

        const row = this.transformRow(
          transaction,
          status,
          categorized.length > 0 || matched.length > 0,
          Array.from(new Set(uncategorizedTransactionIds)),
          noSelectedKeys,
          reconciliation.startDate,
        );

        return {
          ...row,
          isChecked: true,
          isReconciled: true,
        };
      })
      .filter(Boolean) as IBankReconciliationTransactionRow[];

    return rows.sort((a, b) => {
      const dateDifference =
        moment(a.date).valueOf() - moment(b.date).valueOf();
      return dateDifference !== 0 ? dateDifference : a.index - b.index;
    });
  };

  /**
   * Retrieves the number of uncategorized bank-feed transactions.
   */
  public getUncategorizedTransactionsCount = async (
    accountId: number,
  ): Promise<number> => {
    const result = await this.uncategorizedModel()
      .query()
      .where('accountId', accountId)
      .modify('notExcluded')
      .modify('notPending')
      .modify('notCategorized')
      .withGraphJoined('matchedBankTransactions')
      .whereNull('matchedBankTransactions.id')
      .countDistinct('uncategorized_cashflow_transactions.id as total')
      .first();

    return Number((result as any)?.total ?? 0);
  };
}
