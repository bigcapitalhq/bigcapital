import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IBillPaymentDTO } from '@/interfaces';
import { CreateBillPayment } from './CreateBillPayment';
import { Importable } from '@/services/Import/Importable';
import { BillsPaymentsSampleData } from './constants';

@Service()
export class BillPaymentsImportable extends Importable {
  @Inject()
  private createBillPaymentService: CreateBillPayment;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    tenantId: number,
    billPaymentDTO: IBillPaymentDTO,
    trx?: Knex.Transaction
  ) {
    return this.createBillPaymentService.createBillPayment(
      tenantId,
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
