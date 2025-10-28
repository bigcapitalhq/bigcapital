import { Knex } from 'knex';
import { CreateTaxRate } from './commands/CreateTaxRate.service';
import { Importable } from '../Import/Importable';
import { TaxRatesSampleData } from './TaxRatesImportable.SampleData';
import { CreateTaxRateDto } from './dtos/TaxRate.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaxRatesImportable extends Importable {
  constructor(private readonly createTaxRateService: CreateTaxRate) {
    super();
  }

  /**
   * Importing to tax rate creating service.
   * @param {CreateTaxRateDto} ICreateTaxRateDTO -
   * @param {Knex.Transaction} trx -
   */
  public importable(
    createAccountDTO: CreateTaxRateDto,
    trx?: Knex.Transaction,
  ) {
    return this.createTaxRateService.createTaxRate(createAccountDTO, trx);
  }

  /**
   * Concurrrency controlling of the importing process.
   * @returns {number}
   */
  public get concurrency() {
    return 1;
  }

  /**
   * Retrieves the sample data that used to download accounts sample sheet.
   */
  public sampleData(): any[] {
    return TaxRatesSampleData;
  }
}
