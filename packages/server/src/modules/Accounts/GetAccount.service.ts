import { Inject, Injectable } from '@nestjs/common';
import { AccountTransformer } from './Account.transformer';
import { Account } from './models/Account.model';
import { AccountRepository } from './repositories/Account.repository';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { AccountResponseDto } from './dtos/AccountResponse.dto';

@Injectable()
export class GetAccount {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
    private readonly accountRepository: AccountRepository,
    private readonly transformer: TransformerInjectable,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Retrieve the given account details.
   * @param {number} accountId - The account id.
   * @returns {Promise<IAccount>} - The account details.
   */
  public async getAccount(accountId: number): Promise<AccountResponseDto> {
    // Find the given account or throw not found error.
    const account = await this.accountModel()
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
  }
}
