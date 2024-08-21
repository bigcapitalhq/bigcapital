import { Inject, Service } from 'typedi';
import { Exportable } from '../Export/Exportable';
import { TaxRatesApplication } from './TaxRatesApplication';

@Service()
export class TaxRatesExportable extends Exportable {
  @Inject()
  private taxRatesApplication: TaxRatesApplication;

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {number} tenantId
   * @returns
   */
  public exportable(tenantId: number) {
    return this.taxRatesApplication.getTaxRates(tenantId);
  }
}
