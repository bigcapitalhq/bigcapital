import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { Importable } from '@/services/Import/Importable';
import CreateVendorCredit from './CreateVendorCredit';
import { IVendorCreditCreateDTO } from '@/interfaces';
import { VendorCreditsSampleData } from './constants';

@Service()
export class VendorCreditsImportable extends Importable {
  @Inject()
  private createVendorCreditService: CreateVendorCredit;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    tenantId: number,
    createPaymentDTO: IVendorCreditCreateDTO,
    trx?: Knex.Transaction
  ) {
    return this.createVendorCreditService.newVendorCredit(
      tenantId,
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
