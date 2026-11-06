import { Inject, Injectable } from '@nestjs/common';
import { BankReconciliation } from '../models/BankReconciliation';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { BankingReconciliationRepository } from './BankingReconciliationRepository';
import { BankReconciliationTransformer } from './BankReconciliation.transformer';
import { BankReconciliationTransactionTransformer } from './BankReconciliationTransaction.transformer';
import {
  BankReconciliationStatus,
  IBankReconciliationTransactionRow,
  IChangedReconciledTransaction,
} from '../types/BankingReconciliation.types';

@Injectable()
export class GetBankReconciliationService {
  constructor(
    @Inject(BankReconciliation.name)
    private readonly reconciliationModel: TenantModelProxy<
      typeof BankReconciliation
    >,

    private readonly repository: BankingReconciliationRepository,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieves the given reconciliation detail.
   */
  public async getBankReconciliation(reconciliationId: number) {
    const reconciliation =
      await this.repository.getReconciliationOrThrow(reconciliationId);

    const accountId = reconciliation.accountId;

    let rows: IBankReconciliationTransactionRow[] = [];
    let changedTransactions: IChangedReconciledTransaction[] = [];
    let transactionsCount = 0;

    if (reconciliation.isInProgress) {
      const firstStartDate = await this.repository.getFirstStartDate(
        accountId,
        reconciliation.startDate,
      );

      const result = await this.repository.getUnreconciledTransactions({
        accountId,
        startDate: reconciliation.startDate,
        endDate: reconciliation.endDate,
        firstStartDate,
        selectedKeys: reconciliation.draftTransactions ?? [],
      });

      rows = result.rows;
      changedTransactions = result.changedTransactions;

      const clearedBalance =
        Number(reconciliation.beginningBalance) +
        rows
          .filter((row) => row.isChecked)
          .reduce((total, row) => total + (row.debit - row.credit), 0);

      reconciliation.clearedBalance = clearedBalance;
      reconciliation.difference =
        Number(reconciliation.endingBalance ?? 0) - clearedBalance;
      transactionsCount = rows.filter((row) => row.isChecked).length;
    } else if (reconciliation.isReconciled) {
      rows = (reconciliation.transactions ?? []).map((transaction) => ({
        key: this.repository.buildTransactionKey(
          transaction.referenceType,
          transaction.referenceId,
          transaction.transactionIndex,
        ),
        accountTransactionId: null,
        referenceType: transaction.referenceType,
        referenceId: transaction.referenceId,
        index: transaction.transactionIndex,
        date: transaction.date,
        transactionType: transaction.transactionType,
        transactionNumber: transaction.transactionNumber,
        referenceNumber: transaction.referenceNumber,
        note: transaction.note,
        credit: Number(transaction.credit ?? 0),
        debit: Number(transaction.debit ?? 0),
        currencyCode: transaction.currencyCode,
        exchangeRate: transaction.exchangeRate,
        status: transaction.transactionStatus ?? 'manual',
        isBankFeed: Boolean(transaction.isBankFeed),
        isPreviousOutstanding:
          new Date(transaction.date).getTime() <
          new Date(reconciliation.startDate).getTime(),
        isChecked: true,
        isReconciled: true,
        uncategorizedTransactionIds:
          transaction.uncategorizedTransactionIds ?? [],
      }));
      transactionsCount = rows.length;
    }

    const laterReconciliations = await this.reconciliationModel()
      .query()
      .where('accountId', accountId)
      .whereNot('status', BankReconciliationStatus.Voided)
      .where('endDate', '>', reconciliation.endDate)
      .count('id as total')
      .first();

    const isLatest = Number((laterReconciliations as any)?.total ?? 0) === 0;

    const transformedReconciliation = await this.transformer.transform(
      Object.assign(reconciliation, { transactionsCount }),
      new BankReconciliationTransformer(),
    );

    const transformedTransactions = await this.transformer.transform(
      rows,
      new BankReconciliationTransactionTransformer(),
    );

    const meta = {
      isLatest,
      canUndo: reconciliation.isReconciled,
      canDelete: reconciliation.isInProgress || reconciliation.isVoided,
      uncategorizedTransactionsCount: reconciliation.isInProgress
        ? await this.repository.getUncategorizedTransactionsCount(accountId)
        : 0,
      changedTransactions,
    };

    return {
      reconciliation: transformedReconciliation,
      transactions: transformedTransactions,
      meta,
    };
  }
}
