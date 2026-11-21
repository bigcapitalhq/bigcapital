import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { groupBy, keyBy } from 'lodash';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { getReconciliationTransactionTypeLabel } from '@/modules/BankingReconciliation/reconciliation-localization';
import { ReconciliationStatusRepository } from './ReconciliationStatusRepository';
import {
  ReconciliationReportStatus,
  ReconciliationStatusQueryDto,
} from './ReconciliationStatusQuery.dto';
import {
  ReconciliationStatusResponseDto,
  ReconciliationStatusTransactionDto,
} from './ReconciliationStatusResponse.dto';

@Injectable()
export class ReconciliationStatusService {
  constructor(
    private readonly repository: ReconciliationStatusRepository,
    private readonly i18n: I18nService,
  ) {}

  public async getReport(
    query: ReconciliationStatusQueryDto,
  ): Promise<ReconciliationStatusResponseDto> {
    const {
      accountId,
      fromDate,
      toDate,
      status = ReconciliationReportStatus.Reconciled,
    } = query;
    if (fromDate && toDate && fromDate > toDate) {
      throw new BadRequestException(
        this.i18n.t('reconciliation_status.invalid_range'),
      );
    }
    const { bankAccounts, selectedAccounts, balances, transactions } =
      await this.repository.getReportData({ ...query, status });
    if (accountId && selectedAccounts.length === 0) {
      throw new NotFoundException(
        this.i18n.t('reconciliation_status.account_not_found'),
      );
    }
    const balancesByAccount = keyBy(balances, 'accountId');
    const transactionsByAccount = groupBy(transactions, 'accountId');

    return {
      bankAccounts,
      accounts: selectedAccounts.map((account) => {
        const balance = balancesByAccount[account.id];
        const entries = transactionsByAccount[account.id] ?? [];

        return {
          ...account,
          openingBalance: Number(balance?.openingBalance ?? 0),
          closingBalance: Number(balance?.closingBalance ?? 0),
          transactions: entries.map((entry) =>
            this.toReportTransaction(entry, status),
          ),
        };
      }),
    };
  }

  private toReportTransaction(
    transaction: AccountTransaction,
    status: ReconciliationReportStatus,
  ): ReconciliationStatusTransactionDto {
    return {
      id: transaction.id,
      date: transaction.date
        ? moment(transaction.date).format('YYYY-MM-DD')
        : null,
      reference:
        transaction.referenceNumber || transaction.transactionNumber || null,
      type: getReconciliationTransactionTypeLabel(
        this.i18n,
        transaction.referenceType,
        transaction.transactionType,
      ),
      deposit: Number(transaction.debit ?? 0),
      withdrawal: Number(transaction.credit ?? 0),
      status,
    };
  }
}
