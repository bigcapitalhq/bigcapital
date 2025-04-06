import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IPlaidItemCreatedEventPayload } from '../types/BankingPlaid.types';

@Injectable()
export class PlaidUpdateTransactionsOnItemCreatedSubscriber {
  /**
   * Updates the Plaid item transactions
   * @param {IPlaidItemCreatedEventPayload} payload - Event payload.
   */
  @OnEvent(events.plaid.onItemCreated)
  public async handleUpdateTransactionsOnItemCreated({
    tenantId,
    plaidItemId,
    plaidAccessToken,
    plaidInstitutionId,
  }: IPlaidItemCreatedEventPayload) {
    const payload = { tenantId, plaidItemId };
    // await this.agenda.now('plaid-update-account-transactions', payload);
  };
}
