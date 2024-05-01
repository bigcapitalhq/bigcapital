import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { Importable } from '@/services/Import/Importable';
import { CreateBill } from './CreateBill';
import { IBillDTO } from '@/interfaces';
import { BillsSampleData } from './constants';

@Service()
export class BillsImportable extends Importable {
  @Inject()
  private createBillService: CreateBill;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    tenantId: number,
    createAccountDTO: IBillDTO,
    trx?: Knex.Transaction
  ) {
    return this.createBillService.createBill(
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
    return BillsSampleData;
  }
}
