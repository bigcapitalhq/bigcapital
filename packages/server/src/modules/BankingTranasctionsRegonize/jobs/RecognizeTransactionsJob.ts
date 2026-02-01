import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';
import { ClsService, UseCls } from 'nestjs-cls';
import { RecognizeTranasctionsService } from '../commands/RecognizeTranasctions.service';
import {
  RecognizeUncategorizedTransactionsJobPayload,
  RecognizeUncategorizedTransactionsQueue,
} from '../_types';

@Processor({
  name: RecognizeUncategorizedTransactionsQueue,
  scope: Scope.REQUEST,
})
export class RegonizeTransactionsPrcessor extends WorkerHost {
  /**
   * @param {RecognizeTranasctionsService} recognizeTranasctionsService -
   * @param {ClsService} clsService -
   */
  constructor(
    private readonly recognizeTranasctionsService: RecognizeTranasctionsService,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  /**
   * Triggers sending invoice mail.
   */
  @UseCls()
  async process(job: Job<RecognizeUncategorizedTransactionsJobPayload>) {
    const { ruleId, transactionsCriteria } = job.data;

    this.clsService.set('organizationId', job.data.organizationId);
    this.clsService.set('userId', job.data.userId);

    try {
      await this.recognizeTranasctionsService.recognizeTransactions(
        ruleId,
        transactionsCriteria,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
