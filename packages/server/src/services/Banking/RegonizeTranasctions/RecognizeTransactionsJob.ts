import Container, { Service } from 'typedi';
import { RegonizeTranasctionsService } from './RecognizeTranasctionsService';

@Service()
export class RegonizeTransactionsJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'regonize-uncategorized-transactions-job',
      { priority: 'high', concurrency: 2 },
      this.handler
    );
  }

  /**
   * Triggers sending invoice mail.
   */
  private handler = async (job, done: Function) => {
    const { tenantId } = job.attrs.data;
    const regonizeTransactions = Container.get(RegonizeTranasctionsService);

    try {
      await regonizeTransactions.regonizeTransactions(tenantId);
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
