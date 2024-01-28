import { Inject } from 'typedi';
import { ExchangeRatesService } from './ExchangeRatesService';
import { EchangeRateLatestPOJO, ExchangeRateLatestDTO } from '@/interfaces';

export class ExchangeRateApplication {
  @Inject()
  private exchangeRateService: ExchangeRatesService;

  /**
   * Gets the latest exchange rate.
   * @param {number} tenantId
   * @param {ExchangeRateLatestDTO} exchangeRateLatestDTO
   * @returns {Promise<EchangeRateLatestPOJO>}
   */
  public latest(
    tenantId: number,
    exchangeRateLatestDTO: ExchangeRateLatestDTO
  ): Promise<EchangeRateLatestPOJO> {
    return this.exchangeRateService.latest(tenantId, exchangeRateLatestDTO);
  }
}
