import { ExportableService } from '../Export/decorators/ExportableModel.decorator';
import { Exportable } from '../Export/Exportable';
import { TaxRateModel } from './models/TaxRate.model';
import { TaxRatesApplication } from './TaxRate.application';
import { Injectable } from '@nestjs/common';

@Injectable()
@ExportableService({ name: TaxRateModel.name })
export class TaxRatesExportable extends Exportable {
  constructor(private readonly taxRatesApplication: TaxRatesApplication) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   */
  public exportable() {
    return this.taxRatesApplication.getTaxRates();
  }
}
