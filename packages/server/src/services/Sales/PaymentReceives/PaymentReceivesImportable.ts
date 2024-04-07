import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IPaymentReceiveCreateDTO } from '@/interfaces';
import { Importable } from '@/services/Import/Importable';
import { CreatePaymentReceive } from './CreatePaymentReceive';
import { PaymentsReceiveSampleData } from './constants';

@Service()
export class PaymentReceivesImportable extends Importable {
  @Inject()
  private createPaymentReceiveService: CreatePaymentReceive;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    tenantId: number,
    createPaymentDTO: IPaymentReceiveCreateDTO,
    trx?: Knex.Transaction
  ) {
    return this.createPaymentReceiveService.createPaymentReceive(
      tenantId,
      createPaymentDTO,
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
    return PaymentsReceiveSampleData;
  }
}
