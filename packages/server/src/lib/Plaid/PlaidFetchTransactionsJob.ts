import Container, { Service } from 'typedi';

@Service()
export class PlaidFetchTransactionsJob {
  /**
   * Constructor method.
   */
  constructor(agenda) {
    agenda.define(
      'plaid-update-account-transactions',
      { priority: 'high', concurrency: 2 },
      this.handler
    );
  }

  /**
   * Triggers the function.
   */
  private handler = async (job, done: Function) => {
    const {} = job.attrs.data;

    try {
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
