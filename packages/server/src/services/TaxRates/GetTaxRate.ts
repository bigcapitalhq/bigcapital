import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { CommandTaxRatesValidators } from './CommandTaxRatesValidators';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { TaxRateTransformer } from './TaxRateTransformer';

@Service()
export class GetTaxRateService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: CommandTaxRatesValidators;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the given tax rate.
   * @param {number} tenantId
   * @param {number} taxRateId
   * @returns {Promise<ITaxRate>}
   */
  public async getTaxRate(tenantId: number, taxRateId: number) {
    const { TaxRate } = this.tenancy.models(tenantId);

    const taxRate = await TaxRate.query().findById(taxRateId);

    // Validates the tax rate existance.
    this.validators.validateTaxRateExistance(taxRate);

    // Transforms the tax rate.
    return this.transformer.transform(
      tenantId,
      taxRate,
      new TaxRateTransformer()
    );
  }
}
