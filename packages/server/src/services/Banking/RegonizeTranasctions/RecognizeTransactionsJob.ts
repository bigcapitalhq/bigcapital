import Container, { Service } from 'typedi';
import { RecognizeTranasctionsService } from './RecognizeTranasctionsService';

@Service()
export class RegonizeTransactionsJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'recognize-uncategorized-transactions-job',
      { priority: 'high', concurrency: 2 },
      this.handler
    );
  }

  /**
   * Triggers sending invoice mail.
   */
  private handler = async (job, done: Function) => {
    const { tenantId, batch } = job.attrs.data;
    const regonizeTransactions = Container.get(RecognizeTranasctionsService);

    try {
      await regonizeTransactions.recognizeTransactions(tenantId, batch);
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
