import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateSaleReceipt } from './CreateSaleReceipt.service';
import { Importable } from '@/modules/Import/Importable';
import { CreateSaleReceiptDto } from '../dtos/SaleReceipt.dto';
import { SaleReceiptsSampleData } from '../constants';

@Injectable()
export class SaleReceiptsImportable extends Importable {
  constructor(private readonly createReceiptService: CreateSaleReceipt) {
    super();
  }

  /**
   * Importing to sale receipts service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    createAccountDTO: CreateSaleReceiptDto,
    trx?: Knex.Transaction,
  ) {
    return this.createReceiptService.createSaleReceipt(
      createAccountDTO,
      trx,
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
    return SaleReceiptsSampleData;
  }
}
