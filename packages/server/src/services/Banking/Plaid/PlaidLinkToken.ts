import config from '@/config';
import { PlaidClientWrapper } from '@/lib/Plaid';
import { Service } from 'typedi';

@Service()
export class PlaidLinkTokenService {
  /**
   * Retrieves the plaid link token.
   * @param {number} tenantId
   * @returns
   */
  async getLinkToken(tenantId: number) {
    const accessToken = null;

    // Must include transactions in order to receive transactions webhooks
    const products = ['transactions'];
    const linkTokenParams = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: 'uniqueId' + tenantId,
      },
      client_name: 'Pattern',
      products,
      country_codes: ['US'],
      language: 'en',
      webhook: config.plaid.linkWebhook,
      access_token: accessToken,
    };
    const plaidInstance = new PlaidClientWrapper();
    const createResponse = await plaidInstance.linkTokenCreate(linkTokenParams);

    return createResponse.data;
  }
}
