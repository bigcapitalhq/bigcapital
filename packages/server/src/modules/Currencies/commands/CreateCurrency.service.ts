import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import { Currency } from '../models/Currency.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../Currencies.constants';
import { CreateCurrencyDto } from '../dtos/CreateCurrency.dto';

@Injectable()
export class CreateCurrencyService {
  constructor(
    @Inject(Currency.name)
    private readonly currencyModel: TenantModelProxy<typeof Currency>,
  ) {}

  async createCurrency(currencyDTO: CreateCurrencyDto) {
    // Validate currency code uniquiness.
    await this.validateCurrencyCodeUniquiness(currencyDTO.currencyCode);
    await this.currencyModel()
      .query()
      .insert({ ...currencyDTO });
  }

  /**
   * Retrieve currency by given currency code or throw not found error.
   * @param {string} currencyCode
   * @param {number} currencyId
   */
  private async validateCurrencyCodeUniquiness(
    currencyCode: string,
    currencyId?: number,
  ) {
    const foundCurrency = await this.currencyModel()
      .query()
      .onBuild((query) => {
        query.findOne('currency_code', currencyCode);

        if (currencyId) {
          query.whereNot('id', currencyId);
        }
      });
    if (foundCurrency) {
      throw new ServiceError(ERRORS.CURRENCY_CODE_EXISTS);
    }
  }
}
