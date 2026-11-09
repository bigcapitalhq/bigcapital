import { Injectable } from '@nestjs/common';
import { ExchangeRate } from './lib/ExchangeRate';
import { ExchangeRateServiceType } from './lib/types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import {
  ExchangeRateLatestDTO,
  EchangeRateLatestPOJO,
} from './ExchangeRates.types';

@Injectable()
export class ExchangeRatesService {
  constructor(private readonly tenancyContext: TenancyContext) {}

  /**
   * Gets the latest exchange rate.
   * @param {ExchangeRateLatestDTO} exchangeRateLatestDTO
   * @returns {EchangeRateLatestPOJO}
   */
  public async latest(
    exchangeRateLatestDTO: ExchangeRateLatestDTO,
  ): Promise<EchangeRateLatestPOJO> {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    // Assign the organization base currency as a default currency
    // if no currency is provided
    const baseCurrency = tenantMetadata?.baseCurrency;
    const fromCurrency = exchangeRateLatestDTO.fromCurrency || baseCurrency;
    const toCurrency = exchangeRateLatestDTO.toCurrency || baseCurrency;

    const exchange = new ExchangeRate(ExchangeRateServiceType.OpenExchangeRate);
    const exchangeRate = await exchange.latest(fromCurrency, toCurrency);

    return {
      baseCurrency: fromCurrency,
      toCurrency: exchangeRateLatestDTO.toCurrency || toCurrency,
      exchangeRate,
    };
  }
}
