import Axios from 'axios';
import {
  EchangeRateErrors,
  FXMACRODATA_FOREX_URL,
  IExchangeRateService,
} from './types';
import { ServiceError } from '@/modules/Items/ServiceError';

export class FXMacroDataExchangeRate implements IExchangeRateService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FXMACRODATA_API_KEY || '';
  }

  /**
   * Gets the latest exchange rate.
   * @param {string} baseCurrency
   * @param {string} toCurrency
   * @returns {Promise<number>}
   */
  public async latest(
    baseCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    // Validates the FXMacroData api key early.
    this.validateApiKeyExistance();

    if (baseCurrency === toCurrency) {
      return 1;
    }
    try {
      const result = await Axios.get(
        `${FXMACRODATA_FOREX_URL}/${baseCurrency}/${toCurrency}`,
        {
          headers: { 'X-API-Key': this.apiKey },
          params: { limit: 5 },
        },
      );
      // Rows are ordered newest first, a row may carry a null value.
      const row = (result.data?.data || []).find((row) => row.val != null);

      if (!row) {
        throw new ServiceError(
          EchangeRateErrors.EX_RATE_SERVICE_NOT_ALLOWED,
          'No exchange rate is available for the given currencies.',
        );
      }
      return row.val as number;
    } catch (error) {
      this.handleLatestErrors(error);
    }
  }

  /**
   * Validates the FXMacroData api key.
   * @throws {ServiceError}
   */
  private validateApiKeyExistance() {
    if (!this.apiKey) {
      throw new ServiceError(
        EchangeRateErrors.EX_RATE_SERVICE_API_KEY_REQUIRED,
        'Invalid API key provided. Please subscribe at https://fxmacrodata.com/subscribe to get an API key.',
      );
    }
  }

  /**
   * Handles the latest errors.
   * @param {any} error
   * @throws {ServiceError}
   */
  private handleLatestErrors(error: any) {
    const status = error.response?.status;

    if (status === 401) {
      throw new ServiceError(
        EchangeRateErrors.EX_RATE_SERVICE_API_KEY_REQUIRED,
        'Invalid API key provided. Please subscribe at https://fxmacrodata.com/subscribe to get an API key.',
      );
    } else if (status === 429) {
      throw new ServiceError(
        EchangeRateErrors.EX_RATE_LIMIT_EXCEEDED,
        'The exchange rate service request limit has been exceeded.',
      );
    } else if (status === 422) {
      // Unsupported currencies fail the path validation of the base or quote.
      const isBase = (error.response?.data?.detail || []).some((detail) =>
        detail?.loc?.includes('base'),
      );
      if (isBase) {
        throw new ServiceError(
          EchangeRateErrors.EX_RATE_INVALID_BASE_CURRENCY,
          'The given base currency is invalid.',
        );
      }
      throw new ServiceError(
        EchangeRateErrors.EX_RATE_SERVICE_NOT_ALLOWED,
        'Getting the exchange rate from the given base currency to the given currency is not allowed.',
      );
    }
    throw error;
  }
}
