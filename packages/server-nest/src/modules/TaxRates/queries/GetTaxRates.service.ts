import { Inject, Injectable } from '@nestjs/common';
import { TaxRateTransformer } from './TaxRate.transformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TaxRateModel } from '../models/TaxRate.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetTaxRatesService {
  constructor(
    private transformer: TransformerInjectable,
    @Inject(TaxRateModel.name)
    private taxRateModel: TenantModelProxy<typeof TaxRateModel>,
  ) {}

  /**
   * Retrieves the tax rates list.
   * @returns {Promise<ITaxRate[]>}
   */
  public async getTaxRates() {
    // Retrieves the tax rates.
    const taxRates = await this.taxRateModel().query().orderBy('name', 'ASC');

    // Transforms the tax rates.
    return this.transformer.transform(taxRates, new TaxRateTransformer());
  }
}
