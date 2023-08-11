import { ServiceError } from '@/exceptions';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { ITaxRate } from '@/interfaces';
import { ERRORS } from './constants';

@Service()
export class CommandTaxRatesValidators {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validates the tax rate existance.
   * @param {TaxRate | undefined | null} taxRate
   */
  public validateTaxRateExistance(taxRate: ITaxRate | undefined | null) {
    if (!taxRate) {
      throw new ServiceError(ERRORS.TAX_RATE_NOT_FOUND);
    }
  }

  /**
   * Validates the tax code uniquiness.
   * @param {number} tenantId
   * @param {string} taxCode
   */
  public async validateTaxCodeUnique(tenantId: number, taxCode: string) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const foundTaxCode = await TaxRate.query().findOne({ code: taxCode });

    if (foundTaxCode) {
      throw new ServiceError(ERRORS.TAX_CODE_NOT_UNIQUE);
    }
  }
}
