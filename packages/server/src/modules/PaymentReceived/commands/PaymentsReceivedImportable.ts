import { Knex } from 'knex';
import { CreatePaymentReceivedDto } from '../dtos/PaymentReceived.dto';
import { Injectable } from '@nestjs/common';
import { PaymentsReceiveSampleData } from '../constants';
import { CreatePaymentReceivedService } from './CreatePaymentReceived.serivce';
import { Importable } from '@/modules/Import/Importable';
import { ImportableService } from '@/modules/Import/decorators/Import.decorator';
import { PaymentReceived } from '../models/PaymentReceived';

@Injectable()
@ImportableService({ name: PaymentReceived.name })
export class PaymentsReceivedImportable extends Importable {
  constructor(
    private readonly createPaymentReceiveService: CreatePaymentReceivedService,
  ) {
    super();
  }

  /**
   * Importing to account service.
   * @param {CreatePaymentReceivedDto} createAccountDTO
   * @returns
   */
  public importable(
    createPaymentDTO: CreatePaymentReceivedDto,
    trx?: Knex.Transaction,
  ) {
    return this.createPaymentReceiveService.createPaymentReceived(
      createPaymentDTO,
      trx,
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
