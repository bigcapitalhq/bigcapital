import { Inject, Injectable } from '@nestjs/common';
import { PlaidItem } from '../models/PlaidItem';
import { PlaidApi } from 'plaid';
import { PLAID_CLIENT } from '../../Plaid/Plaid.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { SystemPlaidItem } from '../models/SystemPlaidItem';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { IPlaidItemCreatedEventPayload } from '../types/BankingPlaid.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { PlaidItemDto } from '../dtos/PlaidItem.dto';
import { LinkPlaidAccountsService } from './LinkPlaidAccounts.service';

@Injectable()
export class PlaidItemService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,
    private readonly linkPlaidAccounts: LinkPlaidAccountsService,

    @Inject(SystemPlaidItem.name)
    private readonly systemPlaidItemModel: typeof SystemPlaidItem,

    @Inject(PlaidItem.name)
    private readonly plaidItemModel: TenantModelProxy<typeof PlaidItem>,

    @Inject(PLAID_CLIENT)
    private readonly plaidClient: PlaidApi,
  ) {}

  /**
   * Exchanges the public token to get access token and item id and then creates
   * a new Plaid item.
   * @param {PlaidItemDto} itemDTO - Plaid item data transfer object.
   * @returns {Promise<void>}
   */
  public async item(itemDTO: PlaidItemDto): Promise<void> {
    const { publicToken, institutionId } = itemDTO;

    const tenant = await this.tenancyContext.getTenant();
    const tenantId = tenant.id;

    // Exchange the public token for a private access token and store with the item.
    const response = await this.plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const plaidAccessToken = response.data.access_token;
    const plaidItemId = response.data.item_id;

    // Resolve the existing accounts to link before storing the item, and
    // remove the item from Plaid if the links are rejected.
    const accountsLinks = await this.linkPlaidAccounts
      .validateLinks(plaidAccessToken, itemDTO.accounts)
      .catch(async (error) => {
        await this.plaidClient
          .itemRemove({ access_token: plaidAccessToken })
          .catch(() => null);
        throw error;
      });

    // Store the Plaid item metadata on tenant scope.
    const _plaidItem = await this.plaidItemModel().query().insertAndFetch({
      tenantId,
      plaidAccessToken,
      plaidItemId,
      plaidInstitutionId: institutionId,
    });
    // Stores the Plaid item id on system scope.
    await this.systemPlaidItemModel.query().insert({ tenantId, plaidItemId });

    // Links the existing accounts before the first sync creates new ones.
    await this.linkPlaidAccounts.linkAccounts(plaidItemId, accountsLinks);

    // Triggers `onPlaidItemCreated` event.
    await this.eventEmitter.emitAsync(events.plaid.onItemCreated, {
      plaidAccessToken,
      plaidItemId,
      plaidInstitutionId: institutionId,
    } as IPlaidItemCreatedEventPayload);
  }
}
