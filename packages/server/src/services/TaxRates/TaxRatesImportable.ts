import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { ICreateTaxRateDTO } from '@/interfaces';
import { CreateTaxRate } from './CreateTaxRate';
import { Importable } from '../Import/Importable';
import { TaxRatesSampleData } from './TaxRatesImportable.SampleData';

@Service()
export class TaxRatesImportable extends Importable {
  @Inject()
  private createTaxRateService: CreateTaxRate;

  /**
   * Importing to tax rate creating service.
   * @param {number} tenantId -
   * @param {ICreateTaxRateDTO} ICreateTaxRateDTO -
   * @param {Knex.Transaction} trx -
   * @returns
   */
  public importable(
    tenantId: number,
    createAccountDTO: ICreateTaxRateDTO,
    trx?: Knex.Transaction
  ) {
    return this.createTaxRateService.createTaxRate(
      tenantId,
      createAccountDTO,
      trx
    );
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
