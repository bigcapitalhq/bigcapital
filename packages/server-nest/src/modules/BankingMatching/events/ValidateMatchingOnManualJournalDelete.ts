import { Injectable } from '@nestjs/common';
import { ValidateTransactionMatched } from '../commands/ValidateTransactionsMatched.service';
import { OnEvent } from '@nestjs/event-emitter';
import { IManualJournalDeletingPayload } from '@/modules/ManualJournals/types/ManualJournals.types';
import { events } from '@/common/events/events';

@Injectable()
export class ValidateMatchingOnManualJournalDeleteSubscriber {
  constructor(
    private readonly validateNoMatchingLinkedService: ValidateTransactionMatched,
  ) {}

  /**
   * Validates the manual journal transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  @OnEvent(events.manualJournals.onDeleting)
  public async validateMatchingOnManualJournalDeleting({
    oldManualJournal,
    trx,
  }: IManualJournalDeletingPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      'ManualJournal',
      oldManualJournal.id,
      trx,
    );
  }
}
