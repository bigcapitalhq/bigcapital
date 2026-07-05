import { isEqual, omit } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IBankRuleEventCreatedPayload,
  IBankRuleEventDeletedPayload,
  IBankRuleEventEditedPayload,
} from '@/modules/BankRules/types';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  RecognizeUncategorizedTransactionsJob,
  RecognizeUncategorizedTransactionsJobPayload,
  RecognizeUncategorizedTransactionsQueue,
} from '../_types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { IImportFileCommitedEventPayload } from '@/modules/Import/interfaces';
import { ImportModel } from '@/modules/Import/models/Import';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';

@Injectable()
export class TriggerRecognizedTransactionsSubscriber {
  constructor(
    private readonly tenancyContect: TenancyContext,

    @InjectQueue(RecognizeUncategorizedTransactionsQueue)
    private readonly recognizeTransactionsQueue: Queue,

    @Inject(ImportModel.name)
    private readonly importModel: typeof ImportModel,
  ) {}

  /**
   * Triggers the recognize uncategorized transactions job on rule created.
   * @param {IBankRuleEventCreatedPayload} payload -
   */
  @OnEvent(events.bankRules.onCreated)
  async recognizedTransactionsOnRuleCreated({
    bankRule,
  }: IBankRuleEventCreatedPayload) {
    const tenantPayload = await this.tenancyContect.getTenantJobPayload();
    const payload = {
      ruleId: bankRule.id,
      ...tenantPayload,
    } as RecognizeUncategorizedTransactionsJobPayload;

    await this.recognizeTransactionsQueue.add(
      RecognizeUncategorizedTransactionsJob,
      payload,
    );
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule edited.
   * @param {IBankRuleEventEditedPayload} payload -
   */
  @OnEvent(events.bankRules.onEdited)
  async recognizedTransactionsOnRuleEdited({
    editRuleDTO,
    oldBankRule,
    bankRule,
  }: IBankRuleEventEditedPayload) {
    // Cannot continue if the new and old bank rule values are the same,
    // after excluding `createdAt` and `updatedAt` dates.
    if (
      isEqual(
        omit(bankRule, ['createdAt', 'updatedAt']),
        omit(oldBankRule, ['createdAt', 'updatedAt']),
      )
    ) {
      return;
    }
    const tenantPayload = await this.tenancyContect.getTenantJobPayload();
    const payload = {
      ruleId: bankRule.id,
      shouldRevert: true,
      ...tenantPayload,
    } as RecognizeUncategorizedTransactionsJobPayload;

    // Re-recognize the transactions based on the new rules.
    // Setting shouldRevert to true ensures that transactions previously recognized
    // by this or lower-priority rules are re-evaluated against the updated rule.
    await this.recognizeTransactionsQueue.add(
      RecognizeUncategorizedTransactionsJob,
      payload,
    );
  }

  /**
   * Triggers the recognize uncategorized transactions job on rule deleted.
   * @param {IBankRuleEventDeletedPayload} payload -
   */
  @OnEvent(events.bankRules.onDeleted)
  async recognizedTransactionsOnRuleDeleted({
    ruleId,
  }: IBankRuleEventDeletedPayload) {
    const tenantPayload = await this.tenancyContect.getTenantJobPayload();
    const payload = {
      ruleId,
      ...tenantPayload,
    } as RecognizeUncategorizedTransactionsJobPayload;

    // Re-recognize the transactions based on the new rules.
    await this.recognizeTransactionsQueue.add(
      RecognizeUncategorizedTransactionsJob,
      payload,
    );
  }

  /**
   * Triggers the recognize bank transactions once the imported file commit.
   * @param {IImportFileCommitedEventPayload} payload -
   */
  @OnEvent(events.import.onImportCommitted)
  async triggerRecognizeTransactionsOnImportCommitted({
    importId,
  }: IImportFileCommitedEventPayload) {
    const importFile = await this.importModel.query().findOne({ importId });

    // Cannot continue if the imported resource is not bank transactions.
    if (importFile?.resource !== UncategorizedBankTransaction.name) return;

    const batch = importFile.paramsParsed?.batch;
    if (!batch) return;

    const tenantPayload = await this.tenancyContect.getTenantJobPayload();
    const payload = {
      transactionsCriteria: { batch },
      ...tenantPayload,
    } as RecognizeUncategorizedTransactionsJobPayload;

    await this.recognizeTransactionsQueue.add(
      RecognizeUncategorizedTransactionsJob,
      payload,
    );
  }
}
