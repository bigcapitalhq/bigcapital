import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { MutateBaseCurrencyAccounts } from '../MutateBaseCurrencyAccounts';

@Injectable()
export class MutateBaseCurrencyAccountsSubscriber {
  constructor(
    public readonly mutateBaseCurrencyAccounts: MutateBaseCurrencyAccounts,
  ) {}

  /**
   * Updates the all accounts currency once the base currency
   * of the organization is mutated.
   */
  @OnEvent(events.organization.baseCurrencyUpdated)
  async updateAccountsCurrencyOnBaseCurrencyMutated({
    organizationDTO,
  }) {
    await this.mutateBaseCurrencyAccounts.mutateAllAccountsCurrency(
      organizationDTO.baseCurrency
    );
  };
}
