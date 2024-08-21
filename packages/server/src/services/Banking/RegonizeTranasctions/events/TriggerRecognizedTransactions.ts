import { Inject, Service } from 'typedi';
import { isEqual, omit } from 'lodash';
import events from '@/subscribers/events';
import {
  IBankRuleEventCreatedPayload,
  IBankRuleEventDeletedPayload,
  IBankRuleEventEditedPayload,
} from '../../Rules/types';
import { IImportFileCommitedEventPayload } from '@/interfaces/Import';
import { Import } from '@/system/models';

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
    bus.subscribe(
      events.import.onImportCommitted,
      this.triggerRecognizeTransactionsOnImportCommitted.bind(this)
    );
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule created.
   * @param {IBankRuleEventCreatedPayload} payload -
   */
  private async recognizedTransactionsOnRuleCreated({
    tenantId,
    bankRule,
  }: IBankRuleEventCreatedPayload) {
    const payload = { tenantId, ruleId: bankRule.id };

    await this.agenda.now('recognize-uncategorized-transactions-job', payload);
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule edited.
   * @param {IBankRuleEventEditedPayload} payload -
   */
  private async recognizedTransactionsOnRuleEdited({
    tenantId,
    editRuleDTO,
    oldBankRule,
    bankRule,
    ruleId,
  }: IBankRuleEventEditedPayload) {
    const payload = { tenantId, ruleId };

    // Cannot continue if the new and old bank rule values are the same,
    // after excluding `createdAt` and `updatedAt` dates.
    if (
      isEqual(
        omit(bankRule, ['createdAt', 'updatedAt']),
        omit(oldBankRule, ['createdAt', 'updatedAt'])
      )
    ) {
      return;
    }
    await this.agenda.now(
      'rerecognize-uncategorized-transactions-job',
      payload
    );
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule deleted.
   * @param {IBankRuleEventDeletedPayload} payload -
   */
  private async recognizedTransactionsOnRuleDeleted({
    tenantId,
    ruleId,
  }: IBankRuleEventDeletedPayload) {
    const payload = { tenantId, ruleId };
    await this.agenda.now(
      'revert-recognized-uncategorized-transactions-job',
      payload
    );
  }

  /**
   * Triggers the recognize bank transactions once the imported file commit.
   * @param {IImportFileCommitedEventPayload} payload -
   */
  private async triggerRecognizeTransactionsOnImportCommitted({
    tenantId,
    importId,
    meta,
  }: IImportFileCommitedEventPayload) {
    const importFile = await Import.query().findOne({ importId });
    const batch = importFile.paramsParsed.batch;
    const payload = { tenantId, transactionsCriteria: { batch } };

    await this.agenda.now('recognize-uncategorized-transactions-job', payload);
  }
}
