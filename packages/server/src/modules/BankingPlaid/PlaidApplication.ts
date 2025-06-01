import { ClsService } from 'nestjs-cls';
import { Inject, Injectable } from '@nestjs/common';
import { PlaidLinkTokenService } from './queries/GetPlaidLinkToken.service';
import { PlaidItemService } from './command/PlaidItem';
import { PlaidWebooks } from './command/PlaidWebhooks';
import { PlaidItemDto } from './dtos/PlaidItem.dto';
import { SystemPlaidItem } from './models/SystemPlaidItem';
import { TenantModel } from '../System/models/TenantModel';
import { SystemUser } from '../System/models/SystemUser';

@Injectable()
export class PlaidApplication {
  constructor(
    private readonly getLinkTokenService: PlaidLinkTokenService,
    private readonly plaidItemService: PlaidItemService,
    private readonly plaidWebhooks: PlaidWebooks,
    private readonly clsService: ClsService,

    @Inject(SystemPlaidItem.name)
    private readonly systemPlaidItemModel: typeof SystemPlaidItem,

    @Inject(TenantModel.name)
    private readonly tenantModel: typeof TenantModel,

    @Inject(SystemUser.name)
    private readonly systemUserModel: typeof SystemUser,
  ) {}

  /**
   * Retrieves the Plaid link token.
   * @returns {Promise<string>}
   */
  public getLinkToken() {
    return this.getLinkTokenService.getLinkToken();
  }

  /**
   * Exchanges the Plaid access token.
   * @param {PlaidItemDTO} itemDTO
   * @returns
   */
  public exchangeToken(itemDTO: PlaidItemDto): Promise<void> {
    return this.plaidItemService.item(itemDTO);
  }

  /**
   * Listens to Plaid webhooks
   * @param {string} plaidItemId - Plaid item id.
   * @param {string} webhookType - Webhook type.
   * @param {string} webhookCode - Webhook code.
   * @returns {Promise<void>}
   */
  public webhooks(
    plaidItemId: string,
    webhookType: string,
    webhookCode: string,
  ): Promise<void> {
    return this.plaidWebhooks.webhooks(plaidItemId, webhookType, webhookCode);
  }

  public async setupPlaidTenant(plaidItemId: string, callback: () => void) {
    const plaidItem = await this.systemPlaidItemModel
      .query()
      .findOne({ plaidItemId });

    if (!plaidItem) {
      throw new Error('Plaid item not found');
    }
    const tenant = await this.tenantModel
      .query()
      .findOne({ id: plaidItem.tenantId })
      .throwIfNotFound();

    const user = await this.systemUserModel
      .query()
      .findOne({
        tenantId: tenant.id,
      })
      .modify('active')
      .throwIfNotFound();

    this.clsService.set('organizationId', tenant.organizationId);
    this.clsService.set('userId', user.id);

    return callback();
  }
}
