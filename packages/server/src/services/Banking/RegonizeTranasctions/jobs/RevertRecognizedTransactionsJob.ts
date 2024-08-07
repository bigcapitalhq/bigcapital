import Container, { Service } from 'typedi';
import { RevertRecognizedTransactions } from '../RevertRecognizedTransactions';

@Service()
export class RevertRegonizeTransactionsJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'revert-recognized-uncategorized-transactions-job',
      { priority: 'high', concurrency: 2 },
      this.handler
    );
  }

  /**
   * Triggers sending invoice mail.
   */
  private handler = async (job, done: Function) => {
    const { tenantId, ruleId, transactionsCriteria } = job.attrs.data;
    const revertRegonizedTransactions = Container.get(
      RevertRecognizedTransactions
    );

    try {
      await revertRegonizedTransactions.revertRecognizedTransactions(
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
