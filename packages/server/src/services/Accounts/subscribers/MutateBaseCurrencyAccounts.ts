import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { MutateBaseCurrencyAccounts } from '../MutateBaseCurrencyAccounts';

@Service()
export class MutateBaseCurrencyAccountsSubscriber {
  @Inject()
  public mutateBaseCurrencyAccounts: MutateBaseCurrencyAccounts;

  /**
   * Attaches the events with handles.
   * @param bus
   */
  attach(bus) {
    bus.subscribe(
      events.organization.baseCurrencyUpdated,
      this.updateAccountsCurrencyOnBaseCurrencyMutated
    );
  }

  /**
   * Updates the all accounts currency once the base currency
   * of the organization is mutated.
   */
  private updateAccountsCurrencyOnBaseCurrencyMutated = async ({
    tenantId,
    organizationDTO,
  }) => {
    await this.mutateBaseCurrencyAccounts.mutateAllAccountsCurrency(
      tenantId,
      organizationDTO.baseCurrency
    );
  };
}
