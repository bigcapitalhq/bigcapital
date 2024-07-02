import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { UnlinkBankRuleRecognizedTransactions } from '../UnlinkBankRuleRecognizedTransactions';
import { IBankRuleEventDeletingPayload } from '../types';

@Service()
export class UnlinkBankRuleOnDeleteBankRule {
  @Inject()
  private unlinkBankRule: UnlinkBankRuleRecognizedTransactions;

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
    await this.unlinkBankRule.unlinkBankRuleOutRecognizedTransactions(
      tenantId,
      ruleId
    );
  }
}
