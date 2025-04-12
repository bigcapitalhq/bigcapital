import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateBillPaymentService } from './CreateBillPayment.service';
import { Importable } from '@/modules/Import/Importable';
import { CreateBillPaymentDto } from '../dtos/BillPayment.dto';
import { BillsPaymentsSampleData } from '../constants';
import { ImportableService } from '@/modules/Import/decorators/Import.decorator';
import { BillPayment } from '../models/BillPayment';

@Injectable()
@ImportableService({ name: BillPayment.name })
export class BillPaymentsImportable extends Importable {
  constructor(
    private readonly createBillPaymentService: CreateBillPaymentService
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
    billPaymentDTO: CreateBillPaymentDto,
    trx?: Knex.Transaction
  ) {
    return this.createBillPaymentService.createBillPayment(
      billPaymentDTO,
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
    return BillsPaymentsSampleData;
  }
}
