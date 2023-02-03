import { Inject, Service } from 'typedi';
import { uniq } from 'lodash';
import Currencies from 'js-money/lib/currency';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { InitialCurrencies } from './constants';

@Service()
export class InitialCurrenciesSeed {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Seeds the given base currency to the currencies list.
   * @param {number} tenantId
   * @param {string} baseCurrency
   */
  public seedCurrencyByCode = async (
    tenantId: number,
    currencyCode: string
  ): Promise<void> => {
    const { Currency } = this.tenancy.models(tenantId);
    const currencyMeta = Currencies[currencyCode];

    const foundBaseCurrency = await Currency.query().findOne(
      'currency_code',
      currencyCode
    );
    if (!foundBaseCurrency) {
      await Currency.query().insert({
        currency_code: currencyMeta.code,
        currency_name: currencyMeta.name,
        currency_sign: currencyMeta.symbol,
      });
    }
  };

  /**
   * Seeds initial currencies to the organization.
   * @param {number} tenantId
   * @param {string} baseCurrency
   */
  public seedInitialCurrencies = async (
    tenantId: number,
    baseCurrency: string
  ): Promise<void> => {
    const initialCurrencies = uniq([...InitialCurrencies, baseCurrency]);
    // Seed currency opers.
    const seedCurrencyOpers = initialCurrencies.map((currencyCode) => {
      return this.seedCurrencyByCode(tenantId, currencyCode);
    });
    await Promise.all(seedCurrencyOpers);
  };
}
