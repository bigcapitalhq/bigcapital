import { Inject, Injectable } from '@nestjs/common';
import { Currency } from '../models/Currency.model';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import { EditCurrencyDto } from '../dtos/EditCurrency.dto';

@Injectable()
export class EditCurrencyService {
  constructor(
    @Inject(Currency.name)
    private readonly currencyModel: TenantModelProxy<typeof Currency>,
  ) {}

  /**
   * Edit details of the given currency.
   * @param {number} currencyCode - Currency code.
   * @param {ICurrencyDTO} currencyDTO - Edit currency dto.
   */
  public async editCurrency(
    currencyCode: string,
    currencyDTO: EditCurrencyDto,
  ): Promise<Currency> {
    const foundCurrency = await this.currencyModel()
      .query()
      .findOne('currencyCode', currencyCode)
      .throwIfNotFound();

    const currency = await this.currencyModel()
      .query()
      .patchAndFetchById(foundCurrency.id, {
        ...currencyDTO,
      });
    return currency;
  }
}
