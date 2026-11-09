import plaidConfig from '@/common/config/plaid';
import { PlaidLinkTokenService } from './GetPlaidLinkToken.service';

describe('PlaidLinkTokenService', () => {
  it('shows the configured client name in Plaid Link', async () => {
    const plaidClient = {
      linkTokenCreate: jest
        .fn()
        .mockResolvedValue({ data: { link_token: 'link-token' } }),
    };
    const configService = {
      get: jest.fn((key: string) =>
        key === 'plaid.clientName' ? 'Acme Books' : undefined,
      ),
    };
    const service = new PlaidLinkTokenService(
      configService as any,
      plaidClient as any,
    );

    await expect(service.getLinkToken()).resolves.toEqual({
      link_token: 'link-token',
    });
    expect(plaidClient.linkTokenCreate).toHaveBeenCalledWith(
      expect.objectContaining({ client_name: 'Acme Books' }),
    );
  });
});

describe('plaid config', () => {
  const original = process.env.PLAID_CLIENT_NAME;

  afterEach(() => {
    if (original === undefined) delete process.env.PLAID_CLIENT_NAME;
    else process.env.PLAID_CLIENT_NAME = original;
  });

  it('reads the client name from PLAID_CLIENT_NAME', () => {
    process.env.PLAID_CLIENT_NAME = 'Acme Books';
    expect(plaidConfig().clientName).toBe('Acme Books');
  });

  it('defaults the client name when PLAID_CLIENT_NAME is unset or empty', () => {
    delete process.env.PLAID_CLIENT_NAME;
    expect(plaidConfig().clientName).toBe('Bigcapital');

    process.env.PLAID_CLIENT_NAME = '';
    expect(plaidConfig().clientName).toBe('Bigcapital');
  });
});
