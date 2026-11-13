import { CountryCode } from 'plaid';
import plaidConfig from '@/common/config/plaid';
import { PlaidLinkTokenService } from './GetPlaidLinkToken.service';

describe('PlaidLinkTokenService', () => {
  it('uses the configured client name and country codes', async () => {
    const plaidClient = {
      linkTokenCreate: jest
        .fn()
        .mockResolvedValue({ data: { link_token: 'link-token' } }),
    };
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'plaid.clientName') return 'Acme Books';
        if (key === 'plaid.countryCodes') {
          return [CountryCode.Us, CountryCode.Ca];
        }
        return undefined;
      }),
    };
    const service = new PlaidLinkTokenService(
      configService as any,
      plaidClient as any,
    );

    await expect(service.getLinkToken()).resolves.toEqual({
      link_token: 'link-token',
    });
    expect(plaidClient.linkTokenCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        client_name: 'Acme Books',
        country_codes: [CountryCode.Us, CountryCode.Ca],
      }),
    );
  });
});

describe('plaid config', () => {
  const original = process.env.PLAID_CLIENT_NAME;
  const originalCountryCodes = process.env.PLAID_COUNTRY_CODES;

  afterEach(() => {
    if (original === undefined) delete process.env.PLAID_CLIENT_NAME;
    else process.env.PLAID_CLIENT_NAME = original;

    if (originalCountryCodes === undefined) {
      delete process.env.PLAID_COUNTRY_CODES;
    } else {
      process.env.PLAID_COUNTRY_CODES = originalCountryCodes;
    }
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

  it('reads comma-separated country codes from PLAID_COUNTRY_CODES', () => {
    process.env.PLAID_COUNTRY_CODES = 'US,CA';
    expect(plaidConfig().countryCodes).toEqual([
      CountryCode.Us,
      CountryCode.Ca,
    ]);
  });

  it('defaults the country codes to US when unset or empty', () => {
    delete process.env.PLAID_COUNTRY_CODES;
    expect(plaidConfig().countryCodes).toEqual([CountryCode.Us]);

    process.env.PLAID_COUNTRY_CODES = '';
    expect(plaidConfig().countryCodes).toEqual([CountryCode.Us]);
  });

  it('ignores unknown country codes', () => {
    process.env.PLAID_COUNTRY_CODES = 'US,XX,CA';
    expect(plaidConfig().countryCodes).toEqual([
      CountryCode.Us,
      CountryCode.Ca,
    ]);
  });

  it('normalizes country codes and removes duplicates', () => {
    process.env.PLAID_COUNTRY_CODES = ' us , CA ,us';
    expect(plaidConfig().countryCodes).toEqual([
      CountryCode.Us,
      CountryCode.Ca,
    ]);
  });
});
