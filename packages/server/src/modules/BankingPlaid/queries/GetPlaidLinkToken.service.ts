import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PLAID_CLIENT } from '@/modules/Plaid/Plaid.module';
import { CountryCode, PlaidApi, Products } from 'plaid';

@Injectable()
export class PlaidLinkTokenService {
  constructor(
    public readonly configService: ConfigService,

    @Inject(PLAID_CLIENT)
    private readonly plaidClient: PlaidApi,
  ) {}

  /**
   * Retrieves the plaid link token.
   * @param {number} tenantId
   * @returns
   */
  public async getLinkToken() {
    const accessToken = null;

    // Must include transactions in order to receive transactions webhooks
    const linkTokenParams = {
      user: {
        // This should correspond to a unique id for the current user.
        client_user_id: 'uniqueId' + 1,
      },
      client_name: 'Pattern',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
      webhook: this.configService.get('plaid.linkWebhook'),
      access_token: accessToken,
    };
    const createResponse =
      await this.plaidClient.linkTokenCreate(linkTokenParams);

    return createResponse.data;
  }
}
