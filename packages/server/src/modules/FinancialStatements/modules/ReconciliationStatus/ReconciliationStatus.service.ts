import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { groupBy, keyBy, startCase } from 'lodash';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { raw } from 'objection';
import {
  ReconciliationReportStatus,
  ReconciliationStatusQueryDto,
} from './ReconciliationStatusQuery.dto';
import {
  ReconciliationStatusResponseDto,
  ReconciliationStatusTransactionDto,
} from './ReconciliationStatusResponse.dto';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { BankReconciliationTransaction } from '@/modules/BankingReconciliation/models/BankReconciliationTransaction';
import { BankReconciliationStatus } from '@/modules/BankingReconciliation/types/BankingReconciliation.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { IsolationLevel } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

interface AccountBalances {
  accountId: number;
  openingBalance?: number | string;
  closingBalance: number | string;
}

@Injectable()
export class ReconciliationStatusService {
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
    private readonly i18n: I18nService,
  ) {}

  private toReportTransaction(
    transaction: AccountTransaction,
    status: ReconciliationReportStatus,
  ): ReconciliationStatusTransactionDto {
    const typeKey = transaction.referenceTypeFormatted;

    return {
      id: transaction.id,
      date: transaction.date
        ? moment(transaction.date).format('YYYY-MM-DD')
        : null,
      reference:
        transaction.referenceNumber || transaction.transactionNumber || null,
      type: typeKey
        ? this.i18n.t(typeKey)
        : startCase(transaction.transactionType || transaction.referenceType) ||
          null,
      deposit: Number(transaction.debit ?? 0),
      withdrawal: Number(transaction.credit ?? 0),
      status,
    };
  }

  public async getReport({
    accountId,
    fromDate,
    toDate,
    status = ReconciliationReportStatus.Reconciled,
  }: ReconciliationStatusQueryDto): Promise<ReconciliationStatusResponseDto> {
    if (fromDate && toDate && fromDate > toDate) {
      throw new BadRequestException(
        'The end date must be on or after the start date.',
      );
    }
    const { baseCurrency } = await this.tenancyContext.getTenantMetadata();

    // Read the balances and transaction statuses from the same ledger snapshot.
    return this.unitOfWork.withTransaction(
      async (trx) => {
        const accountQuery = this.accountModel()
          .query(trx)
          .where('accountType', ACCOUNT_TYPE.BANK)
          .select('id', 'name', 'currencyCode')
          .orderBy('name')
          .orderBy('id');

        if (baseCurrency) {
          accountQuery.where('currencyCode', baseCurrency);
        }
        const bankAccounts = (await accountQuery).map(
          ({ id, name, currencyCode }) => ({ id, name, currencyCode }),
        );
        const accounts = accountId
          ? bankAccounts.filter((account) => account.id === accountId)
          : bankAccounts;

        if (accountId && accounts.length === 0) {
          throw new NotFoundException(
            'Bank account not found for reconciliation.',
          );
        }
        if (accounts.length === 0) {
          return { bankAccounts, accounts: [] };
        }

        const ledger = this.transactionModel()
          .query(trx)
          .whereIn(
            'accountId',
            accounts.map((account) => account.id),
          )
          .modify('filterByBasis', AccountingBasis.Accrual)
          .modify('filterDateRange', undefined, toDate);

        const balanceChange = raw(
          'COALESCE(??, 0) - COALESCE(??, 0)',
          'debit',
          'credit',
        );
        const balances = ledger
          .clone()
          .select(
            'accountId',
            raw('SUM(?)', balanceChange).as('closingBalance'),
          )
          .groupBy('accountId')
          .castTo<AccountBalances[]>();

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

        const completedLink = this.reconciliationTransactionModel()
          .query(trx)
          .joinRelated('reconciliation')
          .where('reconciliation.status', BankReconciliationStatus.Reconciled)
          .whereColumn(
            'accountTransactionId',
            `${AccountTransaction.tableName}.id`,
          );
        const transactions = ledger
          .clone()
          .modify('filterDateRange', fromDate, undefined)
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

        if (status === ReconciliationReportStatus.Reconciled) {
          transactions.whereExists(completedLink);
        } else {
          transactions.whereNotExists(completedLink);
        }

        const balancesByAccount = keyBy(await balances, 'accountId');
        const transactionsByAccount = groupBy(await transactions, 'accountId');

        return {
          bankAccounts,
          accounts: accounts.map((account) => ({
            ...account,
            openingBalance: Number(
              balancesByAccount[account.id]?.openingBalance ?? 0,
            ),
            closingBalance: Number(
              balancesByAccount[account.id]?.closingBalance ?? 0,
            ),
            transactions: (transactionsByAccount[account.id] ?? []).map(
              (transaction) => this.toReportTransaction(transaction, status),
            ),
          })),
        };
      },
      undefined,
      IsolationLevel.REPEATABLE_READ,
    );
  }
}
