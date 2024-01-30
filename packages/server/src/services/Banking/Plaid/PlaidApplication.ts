import { Inject, Service } from 'typedi';
import { PlaidLinkTokenService } from './PlaidLinkToken';

@Service()
export class PlaidApplication {
  @Inject()
  private getLinkTokenService: PlaidLinkTokenService;

  /**
   * 
   * @param tenantId 
   * @param itemId 
   * @returns 
   */
  public getLinkToken(tenantId: number) {
    return this.getLinkTokenService.getLinkToken(tenantId);
  }
}
