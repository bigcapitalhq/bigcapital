import { Service } from 'typedi';
import { ExchangeRate } from '@/lib/ExchangeRate/ExchangeRate';
import { ExchangeRateServiceType } from '@/lib/ExchangeRate/types';
import { EchangeRateLatestPOJO, ExchangeRateLatestDTO } from '@/interfaces';

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
    const exchange = new ExchangeRate(ExchangeRateServiceType.OpenExchangeRate);
    const exchangeRate = await exchange.latest(
      'USD',
      exchangeRateLatestDTO.toCurrency
    );

    return {
      baseCurrency: 'USD',
      toCurrency: exchangeRateLatestDTO.toCurrency,
      exchangeRate,
    };
  }
}
