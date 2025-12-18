import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CreateSaleInvoice } from './CreateSaleInvoice.service';
import { Importable } from '@/modules/Import/Importable';
import { CreateSaleInvoiceDto } from '../dtos/SaleInvoice.dto';
import { SaleInvoicesSampleData } from '../constants';
import { ImportableService } from '@/modules/Import/decorators/Import.decorator';
import { SaleInvoice } from '../models/SaleInvoice';

@Injectable()
@ImportableService({ name: SaleInvoice.name })
export class SaleInvoicesImportable extends Importable {
  constructor(private readonly createInvoiceService: CreateSaleInvoice) {
    super();
  }

  /**
   * Importing to account service.
   * @param {CreateSaleInvoiceDto} createAccountDTO
   */
  public importable(
    createAccountDTO: CreateSaleInvoiceDto,
    trx?: Knex.Transaction,
  ) {
    return this.createInvoiceService.createSaleInvoice(createAccountDTO, trx);
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
    return SaleInvoicesSampleData;
  }
}
