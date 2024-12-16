import { Inject, Injectable } from '@nestjs/common';
import { AccountTransformer } from './Account.transformer';
import { AccountModel } from './models/Account.model';
import { AccountRepository } from './repositories/Account.repository';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class GetAccount {
  constructor(
    @Inject(AccountModel.name)
    private readonly accountModel: typeof AccountModel,
    private readonly accountRepository: AccountRepository,
    private readonly transformer: TransformerInjectable,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Retrieve the given account details.
   * @param {number} accountId
   */
  public getAccount = async (accountId: number) => {
    // Find the given account or throw not found error.
    const account = await this.accountModel
      .query()
      .findById(accountId)
      .withGraphFetched('plaidItem')
      .throwIfNotFound();

    const accountsGraph = await this.accountRepository.getDependencyGraph();

    // Transforms the account model to POJO.
    const transformed = await this.transformer.transform(
      account,
      new AccountTransformer(),
      { accountsGraph },
    );
    const eventPayload = { accountId };

    // Triggers `onAccountViewed` event.
    await this.eventEmitter.emitAsync(events.accounts.onViewed, eventPayload);

    return transformed;
  };
}
