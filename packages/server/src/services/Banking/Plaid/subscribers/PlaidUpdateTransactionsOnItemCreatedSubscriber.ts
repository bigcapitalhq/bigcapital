import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { IPlaidItemCreatedEventPayload } from '@/interfaces/Plaid';
import events from '@/subscribers/events';

@Service()
export class PlaidUpdateTransactionsOnItemCreatedSubscriber extends EventSubscriber {
  @Inject('agenda')
  private agenda: any;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.plaid.onItemCreated,
      this.handleUpdateTransactionsOnItemCreated
    );
  }

  /**
   * Updates the Plaid item transactions
   * @param {IPlaidItemCreatedEventPayload} payload - Event payload.
   */
  private handleUpdateTransactionsOnItemCreated = async ({
    tenantId,
    plaidItemId,
    plaidAccessToken,
    plaidInstitutionId,
  }: IPlaidItemCreatedEventPayload) => {
    const payload = { tenantId, plaidItemId };
    await this.agenda.now('plaid-update-account-transactions', payload);
  };
}
