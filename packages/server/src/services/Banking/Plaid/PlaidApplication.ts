import { Inject, Service } from 'typedi';
import { PlaidLinkTokenService } from './PlaidLinkToken';
import { PlaidItemService } from './PlaidItem';
import { PlaidItemDTO } from '@/interfaces';
import { PlaidWebooks } from './PlaidWebhooks';

@Service()
export class PlaidApplication {
  @Inject()
  private getLinkTokenService: PlaidLinkTokenService;

  @Inject()
  private plaidItemService: PlaidItemService;

  @Inject()
  private plaidWebhooks: PlaidWebooks;

  /**
   * Retrieves the Plaid link token.
   * @param {number} tenantId
   * @param {number} itemId
   * @returns
   */
  public getLinkToken(tenantId: number) {
    return this.getLinkTokenService.getLinkToken(tenantId);
  }

  /**
   * Exchanges the Plaid access token.
   * @param {number} tenantId
   * @param {PlaidItemDTO} itemDTO
   * @returns
   */
  public exchangeToken(tenantId: number, itemDTO: PlaidItemDTO): Promise<void> {
    return this.plaidItemService.item(tenantId, itemDTO);
  }

  /**
   * Listens to Plaid webhooks
   * @param {number} tenantId 
   * @param {string} webhookType 
   * @param {string} plaidItemId 
   * @param {string} webhookCode 
   * @returns 
   */
  public webhooks(
    tenantId: number,
    plaidItemId: string,
    webhookType: string,
    webhookCode: string
  ) {
    return this.plaidWebhooks.webhooks(
      tenantId,
      plaidItemId,
      webhookType,
      webhookCode
    );
  }
}
