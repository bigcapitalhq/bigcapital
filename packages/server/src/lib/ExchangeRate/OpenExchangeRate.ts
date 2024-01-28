import Axios, { AxiosError } from 'axios';
import {
  EchangeRateErrors,
  IExchangeRateService,
  OPEN_EXCHANGE_RATE_LATEST_URL,
} from './types';
import config from '@/config';
import { ServiceError } from '@/exceptions';

export class OpenExchangeRate implements IExchangeRateService {
  /**
   * Gets the latest exchange rate.
   * @param {string} baseCurrency
   * @param {string} toCurrency
   * @returns {Promise<number}
   */
  public async latest(
    baseCurrency: string,
    toCurrency: string
  ): Promise<number> {
    // Vaclidates the Open Exchange Rate api id early.
    this.validateApiIdExistance();

    try {
      const result = await Axios.get(OPEN_EXCHANGE_RATE_LATEST_URL, {
        params: {
          app_id: config.exchangeRate.openExchangeRate.appId,
          base: baseCurrency,
          symbols: toCurrency,
        },
      });
      return result.data.rates[toCurrency] || (1 as number);
    } catch (error) {
      this.handleLatestErrors(error);
    }
  }

  /**
   * Validates the Open Exchange Rate api id.
   * @throws {ServiceError}
   */
  private validateApiIdExistance() {
    const apiId = config.exchangeRate.openExchangeRate.appId;

    if (!apiId) {
      throw new ServiceError(
        EchangeRateErrors.EX_RATE_SERVICE_API_KEY_REQUIRED,
        'Invalid App ID provided. Please sign up at https://openexchangerates.org/signup, or contact support@openexchangerates.org.'
      );
    }
  }

  /**
   * Handles the latest errors.
   * @param {any} error
   * @throws {ServiceError}
   */
  private handleLatestErrors(error: any) {
    if (error.response.data?.message === 'missing_app_id') {
      throw new ServiceError(
        EchangeRateErrors.EX_RATE_SERVICE_API_KEY_REQUIRED,
        'Invalid App ID provided. Please sign up at https://openexchangerates.org/signup, or contact support@openexchangerates.org.'
      );
    } else if (error.response.data?.message === 'invalid_app_id') {
      throw new ServiceError(
        EchangeRateErrors.EX_RATE_SERVICE_API_KEY_REQUIRED,
        'Invalid App ID provided. Please sign up at https://openexchangerates.org/signup, or contact support@openexchangerates.org.'
      );
    } else if (error.response.data?.message === 'not_allowed') {
      throw new ServiceError(
        EchangeRateErrors.EX_RATE_SERVICE_NOT_ALLOWED,
        'Getting the exchange rate from the given base currency to the given currency is not allowed.'
      );
    } else if (error.response.data?.message === 'invalid_base') {
      throw new ServiceError(
        EchangeRateErrors.EX_RATE_INVALID_BASE_CURRENCY,
        'The given base currency is invalid.'
      );
    }
  }
}
