import { Knex } from 'knex';
import { VendorCreditsSampleData } from '../constants';
import { Injectable } from '@nestjs/common';
import { CreateVendorCreditService } from './CreateVendorCredit.service';
import { CreateVendorCreditDto } from '../dtos/VendorCredit.dto';
import { Importable } from '@/modules/Import/Importable';
import { ImportableService } from '@/modules/Import/decorators/Import.decorator';
import { VendorCredit } from '../models/VendorCredit';

@Injectable()
@ImportableService({ name: VendorCredit.name })
export class VendorCreditsImportable extends Importable {
  constructor(
      private readonly createVendorCreditService: CreateVendorCreditService,
  ) {
    super()
  }

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    createPaymentDTO: CreateVendorCreditDto,
    trx?: Knex.Transaction
  ) {
    return this.createVendorCreditService.newVendorCredit(
      createPaymentDTO,
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
    return VendorCreditsSampleData;
  }
}
