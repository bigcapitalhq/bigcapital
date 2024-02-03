import { Inject, Service } from 'typedi';
import { PlaidLinkTokenService } from './PlaidLinkToken';
import { PlaidItemService } from './PlaidItem';
import { PlaidItemDTO } from '@/interfaces';

@Service()
export class PlaidApplication {
  @Inject()
  private getLinkTokenService: PlaidLinkTokenService;

  @Inject()
  private plaidItemService: PlaidItemService;

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
  public exchangeToken(tenantId: number, itemDTO: PlaidItemDTO) {
    return this.plaidItemService.item(tenantId, itemDTO);
  }
}
