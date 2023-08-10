import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidators';

@Service()
export class GetTaxRateService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: CommandTaxRatesValidators;

  /**
   *
   * @param {number} tenantId
   * @param {number} taxRateId
   * @returns
   */
  public async getTaxRate(tenantId: number, taxRateId: number) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const taxRate = await TaxRate.query().findById(taxRateId);

    this.validators.validateTaxRateExistance(taxRate);

    return taxRate;
  }
}
