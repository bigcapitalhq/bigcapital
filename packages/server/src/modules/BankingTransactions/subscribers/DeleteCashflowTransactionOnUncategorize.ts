import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PromisePool } from '@supercharge/promise-pool';
import { DeleteCashflowTransaction } from '../commands/DeleteCashflowTransaction.service';
import { events } from '@/common/events/events';
import { ICashflowTransactionUncategorizedPayload } from '@/modules/BankingCategorize/types/BankingCategorize.types';

@Injectable()
export class DeleteCashflowTransactionOnUncategorizeSubscriber {
  constructor(
    private readonly deleteCashflowTransactionService: DeleteCashflowTransaction,
  ) {}

  /**
   * Deletes the cashflow transaction once uncategorize the bank transaction.
   * @param {ICashflowTransactionUncategorizedPayload} payload
   */
  @OnEvent(events.cashflow.onTransactionUncategorized)
  public async deleteCashflowTransactionOnUncategorize({
    oldMainUncategorizedTransaction,
    trx,
  }: ICashflowTransactionUncategorizedPayload) {
    // Cannot continue if the main transaction does not reference to cashflow type.
    if (
      oldMainUncategorizedTransaction.categorizeRefType !==
      'CashflowTransaction'
    ) {
      return;
    }
    await this.deleteCashflowTransactionService.deleteCashflowTransaction(
      oldMainUncategorizedTransaction.categorizeRefId,
      trx
    );
  }
}
