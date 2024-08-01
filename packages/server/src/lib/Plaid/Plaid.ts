import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import config from '@/config';

// Wrapper for the Plaid client. This allows us to easily log data for all Plaid client requests.
export class PlaidClientWrapper {
  private static instance: PlaidClientWrapper;
  private client: PlaidApi;

  private constructor() {
    // Initialize the Plaid client.
    const configuration = new Configuration({
      basePath: PlaidEnvironments[config.plaid.env],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': config.plaid.clientId,
          'PLAID-SECRET': config.plaid.secret,
          'Plaid-Version': '2020-09-14',
        },
      },
    });
    this.client = new PlaidApi(configuration);
  }

  public static getClient(): PlaidApi {
    if (!PlaidClientWrapper.instance) {
      PlaidClientWrapper.instance = new PlaidClientWrapper();
    }
    return PlaidClientWrapper.instance.client;
  }
}
