import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { ISaleEstimateDTO } from '@/interfaces';
import { CreateSaleEstimate } from './CreateSaleEstimate';
import { Importable } from '@/services/Import/Importable';
import { SaleEstimatesSampleData } from './constants';

@Service()
export class SaleEstimatesImportable extends Importable {
  @Inject()
  private createEstimateService: CreateSaleEstimate;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    tenantId: number,
    createEstimateDTO: ISaleEstimateDTO,
    trx?: Knex.Transaction
  ) {
    return this.createEstimateService.createEstimate(
      tenantId,
      createEstimateDTO,
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
    return SaleEstimatesSampleData;
  }
}
