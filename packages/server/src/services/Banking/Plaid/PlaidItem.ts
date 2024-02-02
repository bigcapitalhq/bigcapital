import { Inject, Service } from 'typedi';
import { PlaidClientWrapper } from '@/lib/Plaid';
import { PlaidItemDTO } from './_types';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { PlaidUpdateTransactions } from '@/lib/Plaid/PlaidUpdateTransactions';

@Service()
export class PlaidItemService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private plaidUpdateTranasctions: PlaidUpdateTransactions;

  /**
   * 
   * @param {number} tenantId 
   * @param {PlaidItemDTO} itemDTO 
   */
  public async item(tenantId: number, itemDTO: PlaidItemDTO) {
    const { PlaidItem } = this.tenancy.models(tenantId);
    const { publicToken, institutionId } = itemDTO;

    const plaidInstance = new PlaidClientWrapper();

    // exchange the public token for a private access token and store with the item.
    const response = await plaidInstance.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const plaidAccessToken = response.data.access_token;
    const plaidItemId = response.data.item_id;

    const plaidItem = await PlaidItem.query().insertAndFetch({
      tenantId,
      plaidAccessToken,
      plaidItemId,
      plaidInstitutionId: institutionId,
    });
    
    this.plaidUpdateTranasctions.updateTransactions(tenantId, plaidItemId);
  }
}
