import { Injectable } from '@nestjs/common';
import { ExchangeRatesService } from './ExchangeRates.service';
import {
  ExchangeRateLatestDTO,
  EchangeRateLatestPOJO,
} from './ExchangeRates.types';

@Injectable()
export class ExchangeRateApplication {
  constructor(private readonly exchangeRateService: ExchangeRatesService) {}

  /**
   * Gets the latest exchange rate.
   * @param {number} tenantId
   * @param {ExchangeRateLatestDTO} exchangeRateLatestDTO
   * @returns {Promise<EchangeRateLatestPOJO>}
   */
  public latest(
    tenantId: number,
    exchangeRateLatestDTO: ExchangeRateLatestDTO,
  ): Promise<EchangeRateLatestPOJO> {
    return this.exchangeRateService.latest(tenantId, exchangeRateLatestDTO);
  }
}
