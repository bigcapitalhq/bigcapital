import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class GetTaxRatesService {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   *
   * @param {number} tenantId
   * @returns
   */
  public async getTaxRates(tenantId: number) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const taxRates = await TaxRate.query();

    return taxRates;
  }
}
