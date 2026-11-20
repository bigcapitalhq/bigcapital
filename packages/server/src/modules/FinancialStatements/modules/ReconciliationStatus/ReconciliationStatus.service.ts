import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { groupBy, keyBy, startCase } from 'lodash';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
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
        'The end date must be on or after the start date.',
      );
    }
    const { bankAccounts, selectedAccounts, balances, transactions } =
      await this.repository.getReportData({ ...query, status });
    if (accountId && selectedAccounts.length === 0) {
      throw new NotFoundException('Bank account not found for reconciliation.');
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
}
