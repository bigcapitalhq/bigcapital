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
   * @param {number} currencyId - Currency ID.
   * @param {ICurrencyDTO} currencyDTO - Edit currency dto.
   */
  public async editCurrency(
    currencyId: number,
    currencyDTO: EditCurrencyDto,
  ): Promise<Currency> {
    const foundCurrency = this.currencyModel()
      .query()
      .findById(currencyId)
      .throwIfNotFound();

    // Directly use the provided ID to update the currency
    const currency = await this.currencyModel()
      .query()
      .patchAndFetchById(currencyId, {
        ...currencyDTO,
      });
    return currency;
  }
}
