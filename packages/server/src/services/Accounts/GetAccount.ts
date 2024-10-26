import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { AccountTransformer } from './AccountTransform';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class GetAccount {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Retrieve the given account details.
   * @param {number} tenantId
   * @param {number} accountId
   */
  public getAccount = async (tenantId: number, accountId: number) => {
    const { Account } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Find the given account or throw not found error.
    const account = await Account.query()
      .findById(accountId)
      .withGraphFetched('plaidItem')
      .throwIfNotFound();

    const accountsGraph = await accountRepository.getDependencyGraph();

    // Transformes the account model to POJO.
    const transformed = await this.transformer.transform(
      tenantId,
      account,
      new AccountTransformer(),
      { accountsGraph }
    );
    const eventPayload = { tenantId, accountId };

    // Triggers `onAccountViewed` event.
    await this.eventPublisher.emitAsync(events.accounts.onViewed, eventPayload);

    return transformed;
  };
}
