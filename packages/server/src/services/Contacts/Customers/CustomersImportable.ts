import { Inject, Service } from 'typedi';
import { Importable } from '@/services/Import/Importable';
import { CreateCustomer } from './CRUD/CreateCustomer';
import { Knex } from 'knex';
import { ICustomer, ICustomerNewDTO } from '@/interfaces';

@Service()
export class CustomersImportable extends Importable {
  @Inject()
  private createCustomerService: CreateCustomer;

  /**
   * Mapps the imported data to create a new customer service.
   * @param {number} tenantId
   * @param {ICustomerNewDTO} createDTO
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public async importable(
    tenantId: number,
    createDTO: ICustomerNewDTO,
    trx?: Knex.Transaction<any, any[]>
  ): Promise<void> {
    await this.createCustomerService.createCustomer(tenantId, createDTO, trx);
  }
}
