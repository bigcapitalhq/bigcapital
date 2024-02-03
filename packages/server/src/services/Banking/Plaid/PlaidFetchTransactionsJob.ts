import Container, { Service } from 'typedi';
import { PlaidUpdateTransactions } from './PlaidUpdateTransactions';
import { IPlaidItemCreatedEventPayload } from '@/interfaces';

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
    const { tenantId, plaidItemId } = job.attrs
      .data as IPlaidItemCreatedEventPayload;

    const plaidFetchTransactionsService = Container.get(
      PlaidUpdateTransactions
    );
    try {
      await plaidFetchTransactionsService.updateTransactions(
        tenantId,
        plaidItemId
      );
      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  };
}
