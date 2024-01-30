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

    // must include transactions in order to receive transactions webhooks
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
      // webhook: httpTunnel.public_url + '/services/webhook',
      access_token: accessToken,
    };
    // If user has entered a redirect uri in the .env file
    // if (redirect_uri.indexOf('http') === 0) {
    //   linkTokenParams.redirect_uri = redirect_uri;
    // }
    const plaidInstance = new PlaidClientWrapper();
    const createResponse = await plaidInstance.linkTokenCreate(linkTokenParams);

    return createResponse.data;
  }
}
