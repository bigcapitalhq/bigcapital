import { Knex } from 'knex';
import { CreateBill } from './CreateBill.service';
import { BillsSampleData } from '../Bills.constants';
import { Injectable } from '@nestjs/common';
import { Importable } from '@/modules/Import/Importable';
import { CreateBillDto } from '../dtos/Bill.dto';

@Injectable()
export class BillsImportable extends Importable {
  constructor(
    private readonly createBillService: CreateBill,
  ) {
    super();
  }

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    createBillDto: CreateBillDto,
    trx?: Knex.Transaction
  ) {
    return this.createBillService.createBill(
      createBillDto,
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
    return BillsSampleData;
  }
}
