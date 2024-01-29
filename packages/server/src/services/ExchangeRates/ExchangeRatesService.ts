import { Service } from 'typedi';
import { ExchangeRate } from '@/lib/ExchangeRate/ExchangeRate';
import { ExchangeRateServiceType } from '@/lib/ExchangeRate/types';
import { EchangeRateLatestPOJO, ExchangeRateLatestDTO } from '@/interfaces';
import { TenantMetadata } from '@/system/models';

@Service()
export class ExchangeRatesService {
  /**
   * Gets the latest exchange rate.
   * @param {number} tenantId
   * @param {number} exchangeRateLatestDTO
   * @returns {EchangeRateLatestPOJO}
   */
  public async latest(
    tenantId: number,
    exchangeRateLatestDTO: ExchangeRateLatestDTO
  ): Promise<EchangeRateLatestPOJO> {
    const organization = await TenantMetadata.query().findOne({ tenantId });

    // Assign the organization base currency as a default currency
    // if no currency is provided
    const fromCurrency =
      exchangeRateLatestDTO.fromCurrency || organization.baseCurrency;
    const toCurrency =
      exchangeRateLatestDTO.toCurrency || organization.baseCurrency;

    const exchange = new ExchangeRate(ExchangeRateServiceType.OpenExchangeRate);
    const exchangeRate = await exchange.latest(fromCurrency, toCurrency);

    return {
      baseCurrency: fromCurrency,
      toCurrency: exchangeRateLatestDTO.toCurrency,
      exchangeRate,
    };
  }
}
