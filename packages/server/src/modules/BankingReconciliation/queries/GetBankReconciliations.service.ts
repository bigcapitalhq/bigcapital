import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { BankReconciliation } from '../models/BankReconciliation';
import { BankReconciliationTransaction } from '../models/BankReconciliationTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { formatNumber } from '@/utils/format-number';
import { GetBankReconciliationsQueryDto } from '../dtos/GetBankReconciliationsQuery.dto';
import { BankingReconciliationRepository } from './BankingReconciliationRepository';
import { BankReconciliationTransformer } from './BankReconciliation.transformer';

const DATE_FORMAT = 'YYYY-MM-DD';

@Injectable()
export class GetBankReconciliationsService {
  constructor(
    @Inject(BankReconciliation.name)
    private readonly reconciliationModel: TenantModelProxy<
      typeof BankReconciliation
    >,

    @Inject(BankReconciliationTransaction.name)
    private readonly reconciliationTransactionModel: TenantModelProxy<
      typeof BankReconciliationTransaction
    >,

    private readonly repository: BankingReconciliationRepository,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieves the reconciliations of the given bank account.
   */
  public async getBankReconciliations(query: GetBankReconciliationsQueryDto) {
    const account = await this.repository.getAccount(query.accountId);

    const reconciliations = await this.reconciliationModel()
      .query()
      .where('accountId', account.id)
      .withGraphFetched('account')
      .orderBy('endDate', 'desc')
      .orderBy('id', 'desc');

    const counts = await this.reconciliationTransactionModel()
      .query()
      .where('accountId', account.id)
      .select('reconciliationId')
      .count('id as total')
      .groupBy('reconciliationId');

    const countsMap = new Map(
      counts.map((row: any) => [
        Number(row.reconciliationId),
        Number(row.total ?? 0),
      ]),
    );

    const reconciliationsWithCount = reconciliations.map((reconciliation) => {
      (reconciliation as any).transactionsCount = reconciliation.isInProgress
        ? (reconciliation.draftTransactions?.length ?? 0)
        : (countsMap.get(reconciliation.id) ?? 0);
      return reconciliation;
    });

    const data = await this.transformer.transform(
      reconciliationsWithCount,
      new BankReconciliationTransformer(),
    );

    const inProgress = reconciliations.find(
      (reconciliation) => reconciliation.isInProgress,
    );
    const latestReconciled = reconciliations.find(
      (reconciliation) => reconciliation.isReconciled,
    );
    const firstTransactionDate = await this.repository.getFirstTransactionDate(
      account.id,
    );

    const support = await this.repository.getAccountSupport(account);

    const suggestedStartDate = latestReconciled
      ? moment(latestReconciled.endDate).add(1, 'day').format(DATE_FORMAT)
      : firstTransactionDate
        ? moment(firstTransactionDate).format(DATE_FORMAT)
        : moment().format(DATE_FORMAT);

    const meta = {
      accountId: account.id,
      accountName: account.name,
      currencyCode: account.currencyCode,
      accountAmount: Number(account.amount ?? 0),
      formattedAccountAmount: formatNumber(account.amount ?? 0, {
        currencyCode: account.currencyCode,
      }),
      bankBalance:
        account.bankBalance === null || account.bankBalance === undefined
          ? null
          : Number(account.bankBalance),
      formattedBankBalance:
        account.bankBalance === null || account.bankBalance === undefined
          ? ''
          : formatNumber(account.bankBalance, {
              currencyCode: account.currencyCode,
            }),
      isSupported: support.isSupported,
      unsupportedReason: support.unsupportedReason,
      hasInProgress: Boolean(inProgress),
      inProgressId: inProgress?.id ?? null,
      lastReconciledEndDate: latestReconciled
        ? moment(latestReconciled.endDate).format(DATE_FORMAT)
        : null,
      firstTransactionDate: firstTransactionDate
        ? moment(firstTransactionDate).format(DATE_FORMAT)
        : null,
      suggestedStartDate,
      suggestedEndDate: moment().format(DATE_FORMAT),
      uncategorizedTransactionsCount:
        await this.repository.getUncategorizedTransactionsCount(account.id),
    };

    return { data, meta };
  }
}
