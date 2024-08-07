import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { IBankRuleEventDeletingPayload } from '../types';
import { RevertRecognizedTransactions } from '../../RegonizeTranasctions/RevertRecognizedTransactions';

@Service()
export class UnlinkBankRuleOnDeleteBankRule {
  @Inject()
  private revertRecognizedTransactionsService: RevertRecognizedTransactions;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.bankRules.onDeleting,
      this.unlinkBankRuleOutRecognizedTransactionsOnRuleDeleting.bind(this)
    );
  }

  /**
   * Unlinks the bank rule out of recognized transactions.
   * @param {IBankRuleEventDeletingPayload} payload -
   */
  private async unlinkBankRuleOutRecognizedTransactionsOnRuleDeleting({
    tenantId,
    ruleId,
  }: IBankRuleEventDeletingPayload) {
    await this.revertRecognizedTransactionsService.revertRecognizedTransactions(
      tenantId,
      ruleId
    );
  }
}
