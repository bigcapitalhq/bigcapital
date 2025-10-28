import { Knex } from 'knex';
import { CustomersSampleData } from './_SampleData';
import { Injectable } from '@nestjs/common';
import { Importable } from '../Import/Importable';
import { CreateCustomer } from './commands/CreateCustomer.service';
import { CreateCustomerDto } from './dtos/CreateCustomer.dto';

@Injectable()
export class CustomersImportable extends Importable {
  constructor(private readonly createCustomerService: CreateCustomer) {
    super();
  }

  /**
   * Mapps the imported data to create a new customer service.
   * @param {number} tenantId
   * @param {ICustomerNewDTO} createDTO
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public async importable(
    createDTO: CreateCustomerDto,
    trx?: Knex.Transaction<any, any[]>,
  ): Promise<void> {
    await this.createCustomerService.createCustomer(createDTO, trx);
  }

  /**
   * Retrieves the sample data of customers used to download sample sheet.
   */
  public sampleData(): any[] {
    return CustomersSampleData;
  }
}
