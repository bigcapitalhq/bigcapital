import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import { Currency } from '../models/Currency.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ERRORS } from '../Currencies.constants';

@Injectable()
export class DeleteCurrencyService {
  constructor(
    @Inject(Currency.name)
    private readonly currencyModel: TenantModelProxy<typeof Currency>,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Delete the given currency code.
   * @param {string} currencyCode
   * @return {Promise<void>}
   */
  public async deleteCurrency(currencyCode: string): Promise<void> {
    const foundCurrency = await this.currencyModel().query()
      .findOne('currency_code', currencyCode)
      .throwIfNotFound();

    // Validate currency code not equals base currency.
    await this.validateCannotDeleteBaseCurrency(currencyCode);

    await this.currencyModel()
      .query()
      .where('currency_code', currencyCode)
      .delete();
  }

  /**
   * Validate cannot delete base currency.
   * @param {string} currencyCode
   */
  private async validateCannotDeleteBaseCurrency(currencyCode: string) {
    const tenant = await this.tenancyContext.getTenant(true);

    if (tenant.metadata.baseCurrency === currencyCode) {
      throw new ServiceError(ERRORS.CANNOT_DELETE_BASE_CURRENCY);
    }
  }
}
