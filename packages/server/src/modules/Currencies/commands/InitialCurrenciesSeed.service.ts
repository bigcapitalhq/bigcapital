import { Inject, Injectable } from '@nestjs/common';
import { uniq } from 'lodash';
import * as Currencies from 'js-money/lib/currency';
import { InitialCurrencies } from '../Currencies.constants';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import { Currency } from '../models/Currency.model';

/**
 * Metadata for ISO 4217 currencies that the js-money library does not
 * carry. Used when seeding so a currency outside js-money's list seeds
 * instead of crashing on an undefined lookup.
 */
const ExtraCurrencyMeta: Record<
  string,
  { code: string; name: string; symbol: string }
> = {
  XCD: {
    code: 'XCD',
    name: 'East Caribbean Dollar',
    symbol: 'EC$',
  },
};

@Injectable()
export class InitialCurrenciesSeedService {
  constructor(
    @Inject(Currency.name)
    private readonly currencyModel: TenantModelProxy<typeof Currency>,
  ) {}

  /**
   * Seeds the given base currency to the currencies list.
   * @param {string} baseCurrency - Base currency code.
   */
  public async seedCurrencyByCode(currencyCode: string): Promise<void> {
    const currencyMeta =
      Currencies[currencyCode] ?? ExtraCurrencyMeta[currencyCode];

    const foundBaseCurrency = await this.currencyModel()
      .query()
      .findOne('currency_code', currencyCode);
    if (!foundBaseCurrency) {
      await this.currencyModel().query().insert({
        currencyCode: currencyMeta.code,
        currencyName: currencyMeta.name,
        currencySign: currencyMeta.symbol,
      });
    }
  }

  /**
   * Seeds initial currencies to the organization.
   * @param {string} baseCurrency - Base currency code.
   */
  public async seedInitialCurrencies(baseCurrency: string): Promise<void> {
    const initialCurrencies = uniq([...InitialCurrencies, baseCurrency]);

    // Seed currency opers.
    const seedCurrencyOpers = initialCurrencies.map((currencyCode) => {
      return this.seedCurrencyByCode(currencyCode);
    });
    await Promise.all(seedCurrencyOpers);
  }
}
