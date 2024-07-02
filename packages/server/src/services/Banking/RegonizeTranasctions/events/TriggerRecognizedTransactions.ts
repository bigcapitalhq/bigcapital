import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  IBankRuleEventCreatedPayload,
  IBankRuleEventDeletedPayload,
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
      this.recognizedTransactionsOnRuleEdited.bind(this)
    );
    bus.subscribe(
      events.bankRules.onDeleted,
      this.recognizedTransactionsOnRuleDeleted.bind(this)
    );
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule created.
   * @param {IBankRuleEventCreatedPayload} payload -
   */
  private async recognizedTransactionsOnRuleCreated({
    tenantId,
    createRuleDTO,
  }: IBankRuleEventCreatedPayload) {
    const payload = { tenantId };

    // Cannot run recognition if the option is not enabled.
    if (createRuleDTO.recognition) {
      return;
    }
    await this.agenda.now('recognize-uncategorized-transactions-job', payload);
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule edited.
   * @param {IBankRuleEventEditedPayload} payload -
   */
  private async recognizedTransactionsOnRuleEdited({
    tenantId,
    editRuleDTO,
  }: IBankRuleEventEditedPayload) {
    const payload = { tenantId };

    // Cannot run recognition if the option is not enabled.
    if (!editRuleDTO.recognition) {
      return;
    }
    await this.agenda.now('recognize-uncategorized-transactions-job', payload);
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule deleted.
   * @param {IBankRuleEventDeletedPayload} payload -
   */
  private async recognizedTransactionsOnRuleDeleted({
    tenantId,
  }: IBankRuleEventDeletedPayload) {
    const payload = { tenantId };
    await this.agenda.now('recognize-uncategorized-transactions-job', payload);
  }
}
