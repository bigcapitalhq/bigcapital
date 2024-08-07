import Container, { Service } from 'typedi';
import { RecognizeTranasctionsService } from '../RecognizeTranasctionsService';
import { RevertRecognizedTransactions } from '../RevertRecognizedTransactions';

@Service()
export class ReregonizeTransactionsJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'rerecognize-uncategorized-transactions-job',
      { priority: 'high', concurrency: 2 },
      this.handler
    );
  }

  /**
   * Triggers sending invoice mail.
   */
  private handler = async (job, done: Function) => {
    const { tenantId, ruleId, transactionsCriteria } = job.attrs.data;
    const regonizeTransactions = Container.get(RecognizeTranasctionsService);
    const revertRegonizedTransactions = Container.get(
      RevertRecognizedTransactions
    );

    try {
      await revertRegonizedTransactions.revertRecognizedTransactions(
        tenantId,
        ruleId,
        transactionsCriteria
      );
      await regonizeTransactions.recognizeTransactions(
        tenantId,
        ruleId,
        transactionsCriteria
      );
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
