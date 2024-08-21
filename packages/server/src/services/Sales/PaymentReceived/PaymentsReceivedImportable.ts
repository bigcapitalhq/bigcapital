import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IPaymentReceivedCreateDTO } from '@/interfaces';
import { Importable } from '@/services/Import/Importable';
import { CreatePaymentReceived } from './CreatePaymentReceived';
import { PaymentsReceiveSampleData } from './constants';

@Service()
export class PaymentsReceivedImportable extends Importable {
  @Inject()
  private createPaymentReceiveService: CreatePaymentReceived;

  /**
   * Importing to account service.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} createAccountDTO
   * @returns
   */
  public importable(
    tenantId: number,
    createPaymentDTO: IPaymentReceivedCreateDTO,
    trx?: Knex.Transaction
  ) {
    return this.createPaymentReceiveService.createPaymentReceived(
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
