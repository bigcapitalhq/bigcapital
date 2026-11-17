import { castCommaListEnvVarToArray } from '@/utils/cast-comma-list-envvar-Array';
import { registerAs } from '@nestjs/config';
import { CountryCode } from 'plaid';

const DEFAULT_COUNTRY_CODES: CountryCode[] = [CountryCode.Us];

/**
 * Parses the comma-separated `PLAID_COUNTRY_CODES` environment variable into
 * country codes supported by Plaid, ignoring any unknown values.
 * @param {string} value - Comma-separated country codes.
 * @returns {CountryCode[]}
 */
export const parsePlaidCountryCodes = (value?: string): CountryCode[] => {
  const supportedCodes = Object.values(CountryCode);
  const countryCodes = castCommaListEnvVarToArray(value)
    .map((code) => code.toUpperCase())
    .filter((code) => supportedCodes.includes(code as CountryCode));

  return countryCodes.length
    ? [...new Set(countryCodes as CountryCode[])]
    : DEFAULT_COUNTRY_CODES;
};

export default registerAs('plaid', () => ({
  env: process.env.PLAID_ENV || 'sandbox',
  clientId: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  linkWebhook: process.env.PLAID_LINK_WEBHOOK,
  // Shown to users in Plaid Link; Link shows "This Application" past 30 characters.
  clientName: process.env.PLAID_CLIENT_NAME || 'Bigcapital',
  // Countries enabled in Plaid Link and institution lookups.
  countryCodes: parsePlaidCountryCodes(process.env.PLAID_COUNTRY_CODES),
}));
