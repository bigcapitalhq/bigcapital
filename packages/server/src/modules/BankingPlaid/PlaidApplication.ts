import { PlaidLinkTokenService } from './queries/GetPlaidLinkToken.service';
import { PlaidItemService } from './command/PlaidItem';
import { PlaidWebooks } from './command/PlaidWebhooks';
import { Injectable } from '@nestjs/common';
import { PlaidItemDTO } from './types/BankingPlaid.types';
import { PlaidItemDto } from './dtos/PlaidItem.dto';

@Injectable()
export class PlaidApplication {
  constructor(
    private readonly getLinkTokenService: PlaidLinkTokenService,
    private readonly plaidItemService: PlaidItemService,
    private readonly plaidWebhooks: PlaidWebooks,
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
    return this.plaidWebhooks.webhooks(
      plaidItemId,
      webhookType,
      webhookCode,
    );
  }
}
