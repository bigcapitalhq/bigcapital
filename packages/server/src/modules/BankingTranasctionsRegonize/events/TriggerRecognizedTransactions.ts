import { isEqual, omit } from 'lodash';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IBankRuleEventCreatedPayload, IBankRuleEventDeletedPayload, IBankRuleEventEditedPayload } from '@/modules/BankRules/types';

@Injectable()
export class TriggerRecognizedTransactionsSubscriber {
  /**
   * Triggers the recognize uncategorized transactions job on rule created.
   * @param {IBankRuleEventCreatedPayload} payload -
   */
  @OnEvent(events.bankRules.onCreated)
  private async recognizedTransactionsOnRuleCreated({
    bankRule,
  }: IBankRuleEventCreatedPayload) {
    const payload = { ruleId: bankRule.id };

    // await this.agenda.now('recognize-uncategorized-transactions-job', payload);
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule edited.
   * @param {IBankRuleEventEditedPayload} payload -
   */
  @OnEvent(events.bankRules.onEdited)
  private async recognizedTransactionsOnRuleEdited({
    editRuleDTO,
    oldBankRule,
    bankRule,
  }: IBankRuleEventEditedPayload) {
    const payload = { ruleId: bankRule.id };

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
    // await this.agenda.now(
    //   'rerecognize-uncategorized-transactions-job',
    //   payload
    // );
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule deleted.
   * @param {IBankRuleEventDeletedPayload} payload -
   */
  @OnEvent(events.bankRules.onDeleted)
  private async recognizedTransactionsOnRuleDeleted({
    ruleId,
  }: IBankRuleEventDeletedPayload) {
    const payload = { ruleId };

    // await this.agenda.now(
    //   'revert-recognized-uncategorized-transactions-job',
    //   payload
    // );
  }

  /**
   * Triggers the recognize bank transactions once the imported file commit.
   * @param {IImportFileCommitedEventPayload} payload -
   */
  @OnEvent(events.import.onImportCommitted)
  private async triggerRecognizeTransactionsOnImportCommitted({
    importId,

    // @ts-ignore
  }: IImportFileCommitedEventPayload) {
    // const importFile = await Import.query().findOne({ importId });
    // const batch = importFile.paramsParsed.batch;
    // const payload = { transactionsCriteria: { batch } };

    // // Cannot continue if the imported resource is not bank account transactions.
    // if (importFile.resource !== 'UncategorizedCashflowTransaction') return;

    // await this.agenda.now('recognize-uncategorized-transactions-job', payload);
  }
}
