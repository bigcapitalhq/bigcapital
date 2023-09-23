import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { TaxRateTransformer } from './TaxRateTransformer';

@Service()
export class GetTaxRatesService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the tax rates list.
   * @param {number} tenantId
   * @returns {Promise<ITaxRate[]>}
   */
  public async getTaxRates(tenantId: number) {
    const { TaxRate } = this.tenancy.models(tenantId);

    // Retrieves the tax rates.
    const taxRates = await TaxRate.query().orderBy('name', 'ASC');

    // Transforms the tax rates.
    return this.transformer.transform(
      tenantId,
      taxRates,
      new TaxRateTransformer()
    );
  }
}
