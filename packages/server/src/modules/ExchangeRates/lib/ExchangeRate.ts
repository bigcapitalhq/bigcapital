import { OpenExchangeRate } from './OpenExchangeRate';
import { ExchangeRateServiceType, IExchangeRateService } from './types';

export class ExchangeRate {
  private exchangeRateService: IExchangeRateService;
  private exchangeRateServiceType: ExchangeRateServiceType;

  /**
   * Constructor method.
   * @param {ExchangeRateServiceType} service
   */
  constructor(service: ExchangeRateServiceType) {
    this.exchangeRateServiceType = service;
    this.initService();
  }

  /**
   * Initialize the exchange rate service based on the service type.
   */
  private initService() {
    if (
      this.exchangeRateServiceType === ExchangeRateServiceType.OpenExchangeRate
    ) {
      this.setExchangeRateService(new OpenExchangeRate());
    }
  }

  /**
   * Sets the exchange rate service.
   * @param {IExchangeRateService} service
   */
  private setExchangeRateService(service: IExchangeRateService) {
    this.exchangeRateService = service;
  }

  /**
   * Gets the latest exchange rate.
   * @param {string} baseCurrency
   * @param {string} toCurrency
   * @returns {number}
   */
  public latest(baseCurrency: string, toCurrency: string): Promise<number> {
    return this.exchangeRateService.latest(baseCurrency, toCurrency);
  }
}
