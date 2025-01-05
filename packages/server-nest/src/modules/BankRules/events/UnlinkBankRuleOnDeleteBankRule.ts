import { IBankRuleEventDeletingPayload } from '../types';
import { Injectable } from '@nestjs/common';
import { RevertRecognizedTransactionsService } from '@/modules/BankingTranasctionsRegonize/commands/RevertRecognizedTransactions.service';
import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UnlinkBankRuleOnDeleteBankRuleSubscriber {
  private revertRecognizedTransactionsService: RevertRecognizedTransactionsService;

  /**
   * Unlinks the bank rule out of recognized transactions.
   * @param {IBankRuleEventDeletingPayload} payload -
   */
  @OnEvent(events.bankRules.onDeleting)
  public async unlinkBankRuleOutRecognizedTransactionsOnRuleDeleting({
    oldBankRule,
  }: IBankRuleEventDeletingPayload) {
    await this.revertRecognizedTransactionsService.revertRecognizedTransactions(
      oldBankRule.id
    );
  }
}
