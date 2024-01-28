import { Service, Inject } from 'typedi';
import { IExchangeRatesService } from '@/interfaces';
import { ExchangeRate } from '@/lib/ExchangeRate/ExchangeRate';
import { ExchangeRateServiceType } from '@/lib/ExchangeRate/types';
interface ExchangeRateLatestDTO {
  toCurrency: string;
}

interface EchangeRateLatestPOJO {
  baseCurrency: string;
  toCurrency: string;
  exchangeRate: number;
}

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
