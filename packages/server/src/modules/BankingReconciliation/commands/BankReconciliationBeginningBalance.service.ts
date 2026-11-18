import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { BankingReconciliationRepository } from '../queries/BankingReconciliationRepository';
import { BankReconciliationValidator } from './BankReconciliationValidator.service';

interface ResolveBeginningBalanceParams {
  accountId: number;
  startDate: Date | string;
  trx?: Knex.Transaction;
  /**
   * When the period start is unchanged, keep the balance already stored
   * on the in-progress reconciliation instead of the previous statement.
   */
  current?: {
    startDate: Date | string;
    beginningBalance: number;
  };
}

@Injectable()
export class BankReconciliationBeginningBalanceService {
  constructor(
    private readonly repository: BankingReconciliationRepository,
    private readonly validator: BankReconciliationValidator,
  ) {}

  /**
   * Opening balance is the previous reconciliation's ending balance, or the
   * ledger balance before the period when this account has not been reconciled.
   */
  public async resolve(params: ResolveBeginningBalanceParams): Promise<number> {
    const { accountId, startDate, trx, current } = params;
    const latestReconciled = await this.validator.getLatestReconciledBefore(
      accountId,
      startDate,
      trx,
    );

    if (
      latestReconciled &&
      current &&
      new Date(startDate).getTime() === new Date(current.startDate).getTime()
    ) {
      return Number(current.beginningBalance);
    }

    if (latestReconciled) {
      return Number(latestReconciled.endingBalance ?? 0);
    }

    return this.repository.getLedgerBalanceBefore(accountId, startDate);
  }
}
