import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IBankRuleEventCreatedPayload,
  IBankRuleEventEditedPayload,
} from '../../Rules/types';

@Service()
export class TriggerRecognizedTransactions {
  @Inject('agenda')
  private agenda: any;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.bankRules.onCreated,
      this.recognizedTransactionsOnRuleCreated.bind(this)
    );
    bus.subscribe(
      events.bankRules.onEdited,
      this.recognizedTransactionsOnRuleCreated.bind(this)
    );
  }

  /**
   * Triggers the recognize uncategorized transactions job.
   * @param {IBankRuleEventEditedPayload | IBankRuleEventCreatedPayload} payload - 
   */
  private async recognizedTransactionsOnRuleCreated({
    tenantId,
  }: IBankRuleEventEditedPayload | IBankRuleEventCreatedPayload) {
    const payload = { tenantId };
    await this.agenda.now('recognize-uncategorized-transactions-job', payload);
  }
}
