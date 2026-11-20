import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { raw } from 'objection';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { BankReconciliationTransaction } from '@/modules/BankingReconciliation/models/BankReconciliationTransaction';
import { BankReconciliationStatus } from '@/modules/BankingReconciliation/types/BankingReconciliation.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { IsolationLevel } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import {
  ReconciliationReportStatus,
  ReconciliationStatusQueryDto,
} from './ReconciliationStatusQuery.dto';
import { ReconciliationStatusBankAccountDto } from './ReconciliationStatusResponse.dto';

type ReportFilter = ReconciliationStatusQueryDto & {
  status: ReconciliationReportStatus;
};

interface AccountBalances {
  accountId: number;
  openingBalance?: number | string;
  closingBalance: number | string;
}

interface ReportData {
  bankAccounts: ReconciliationStatusBankAccountDto[];
  selectedAccounts: ReconciliationStatusBankAccountDto[];
  balances: AccountBalances[];
  transactions: AccountTransaction[];
}

@Injectable()
export class ReconciliationStatusRepository {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
    @Inject(AccountTransaction.name)
    private readonly transactionModel: TenantModelProxy<
      typeof AccountTransaction
    >,
    @Inject(BankReconciliationTransaction.name)
    private readonly reconciliationTransactionModel: TenantModelProxy<
      typeof BankReconciliationTransaction
    >,
    private readonly tenancyContext: TenancyContext,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  public async getReportData(filter: ReportFilter): Promise<ReportData> {
    const { baseCurrency } = await this.tenancyContext.getTenantMetadata();

    // All reads must see the same ledger, even if a reconciliation finishes mid-report.
    return this.unitOfWork.withTransaction(
      async (trx) => {
        const bankAccounts = await this.getBankAccounts(baseCurrency, trx);
        const selectedAccounts = filter.accountId
          ? bankAccounts.filter((account) => account.id === filter.accountId)
          : bankAccounts;

        if (selectedAccounts.length === 0) {
          return {
            bankAccounts,
            selectedAccounts,
            balances: [],
            transactions: [],
          };
        }
        const accountIds = selectedAccounts.map((account) => account.id);
        const balances = await this.getBalances(accountIds, filter, trx);
        const transactions = await this.getTransactions(
          accountIds,
          filter,
          trx,
        );

        return { bankAccounts, selectedAccounts, balances, transactions };
      },
      undefined,
      IsolationLevel.REPEATABLE_READ,
    );
  }

  private async getBankAccounts(
    baseCurrency: string,
    trx: Knex.Transaction,
  ): Promise<ReconciliationStatusBankAccountDto[]> {
    const query = this.accountModel()
      .query(trx)
      .where('accountType', ACCOUNT_TYPE.BANK)
      .select('id', 'name', 'currencyCode')
      .orderBy('name')
      .orderBy('id');

    if (baseCurrency) {
      query.where('currencyCode', baseCurrency);
    }
    return (await query).map(({ id, name, currencyCode }) => ({
      id,
      name,
      currencyCode,
    }));
  }

  private ledgerQuery(accountIds: number[], trx: Knex.Transaction) {
    return this.transactionModel()
      .query(trx)
      .whereIn('accountId', accountIds)
      .modify('filterByBasis', AccountingBasis.Accrual);
  }

  private getBalances(
    accountIds: number[],
    { fromDate, toDate }: ReportFilter,
    trx: Knex.Transaction,
  ) {
    const balanceChange = raw(
      'COALESCE(??, 0) - COALESCE(??, 0)',
      'debit',
      'credit',
    );
    const balances = this.ledgerQuery(accountIds, trx)
      .modify('filterDateRange', undefined, toDate)
      .select('accountId', raw('SUM(?)', balanceChange).as('closingBalance'))
      .groupBy('accountId');

    if (fromDate) {
      balances.select(
        raw(
          'SUM(CASE WHEN ?? < ? THEN ? ELSE 0 END)',
          'date',
          fromDate,
          balanceChange,
        ).as('openingBalance'),
      );
    }
    return balances.castTo<AccountBalances[]>();
  }

  private getTransactions(
    accountIds: number[],
    { fromDate, toDate, status }: ReportFilter,
    trx: Knex.Transaction,
  ) {
    const completedLink = this.reconciliationTransactionModel()
      .query(trx)
      .joinRelated('reconciliation')
      .where('reconciliation.status', BankReconciliationStatus.Reconciled)
      .whereColumn(
        'accountTransactionId',
        `${AccountTransaction.tableName}.id`,
      );
    const transactions = this.ledgerQuery(accountIds, trx)
      .modify('filterDateRange', fromDate, toDate)
      .select(
        'id',
        'accountId',
        'date',
        'referenceNumber',
        'transactionNumber',
        'referenceType',
        'transactionType',
        'debit',
        'credit',
      )
      .orderBy('date')
      .orderBy('id');

    return status === ReconciliationReportStatus.Reconciled
      ? transactions.whereExists(completedLink)
      : transactions.whereNotExists(completedLink);
  }
}
