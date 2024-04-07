import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { ISaleInvoiceCreateDTO } from '@/interfaces';
import { CreateSaleInvoice } from './CreateSaleInvoice';
import { Importable } from '@/services/Import/Importable';
import { SaleInvoicesSampleData } from './constants';

@Service()
export class SaleInvoicesImportable extends Importable {
  @Inject()
  private createInvoiceService: CreateSaleInvoice;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    tenantId: number,
    createAccountDTO: ISaleInvoiceCreateDTO,
    trx?: Knex.Transaction
  ) {
    return this.createInvoiceService.createSaleInvoice(
      tenantId,
      createAccountDTO,
      {},
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
    return SaleInvoicesSampleData;
  }
}
