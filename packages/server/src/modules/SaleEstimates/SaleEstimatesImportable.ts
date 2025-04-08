import { Knex } from 'knex';
import { CreateSaleEstimate } from './commands/CreateSaleEstimate.service';
import { SaleEstimatesSampleData } from './constants';
import { Injectable } from '@nestjs/common';
import { CreateSaleEstimateDto } from './dtos/SaleEstimate.dto';
import { Importable } from '../Import/Importable';

@Injectable()
export class SaleEstimatesImportable extends Importable{
  constructor(
    private readonly createEstimateService: CreateSaleEstimate
  ) {
    super();
  }

  /**
   * Importing to account service.
   * @param {CreateSaleEstimateDto} createAccountDTO
   * @returns
   */
  public importable(
    createEstimateDTO: CreateSaleEstimateDto,
    trx?: Knex.Transaction
  ) {
    return this.createEstimateService.createEstimate(
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
