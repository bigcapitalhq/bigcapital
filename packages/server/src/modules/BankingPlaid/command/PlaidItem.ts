import { Inject, Injectable } from '@nestjs/common';
import { PlaidItem } from '../models/PlaidItem';
import { PlaidApi } from 'plaid';
import { PLAID_CLIENT } from '../../Plaid/Plaid.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { SystemPlaidItem } from '../models/SystemPlaidItem';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import {
  IPlaidItemCreatedEventPayload,
  PlaidItemDTO,
} from '../types/BankingPlaid.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class PlaidItemService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(SystemPlaidItem.name)
    private readonly systemPlaidItemModel: TenantModelProxy<
      typeof SystemPlaidItem
    >,

    @Inject(PlaidItem.name)
    private readonly plaidItemModel: TenantModelProxy<typeof PlaidItem>,

    @Inject(PLAID_CLIENT)
    private readonly plaidClient: PlaidApi,
  ) {}

  /**
   * Exchanges the public token to get access token and item id and then creates
   * a new Plaid item.
   * @param {PlaidItemDTO} itemDTO - Plaid item data transfer object.
   * @returns {Promise<void>}
   */
  public async item(itemDTO: PlaidItemDTO): Promise<void> {
    const { publicToken, institutionId } = itemDTO;

    const tenant = await this.tenancyContext.getTenant();
    const tenantId = tenant.id;

    // Exchange the public token for a private access token and store with the item.
    const response = await this.plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const plaidAccessToken = response.data.access_token;
    const plaidItemId = response.data.item_id;

    // Store the Plaid item metadata on tenant scope.
    const plaidItem = await this.plaidItemModel().query().insertAndFetch({
      tenantId,
      plaidAccessToken,
      plaidItemId,
      plaidInstitutionId: institutionId,
    });
    // Stores the Plaid item id on system scope.
    await this.systemPlaidItemModel().query().insert({ tenantId, plaidItemId });

    // Triggers `onPlaidItemCreated` event.
    await this.eventEmitter.emitAsync(events.plaid.onItemCreated, {
      plaidAccessToken,
      plaidItemId,
      plaidInstitutionId: institutionId,
    } as IPlaidItemCreatedEventPayload);
  }
}
