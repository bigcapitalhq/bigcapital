import { Importable } from '@/services/Import/Importable';
import { CreateVendor } from './CRUD/CreateVendor';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class VendorsImportable extends Importable {
  @Inject()
  private createVendorService: CreateVendor;

  /**
   * Maps the imported data to create a new vendor service.
   * @param {number} tenantId
   * @param {} createDTO
   * @param {Knex.Transaction} trx
   */
  public async importable(
    tenantId: number,
    createDTO: any,
    trx?: Knex.Transaction<any, any[]>
  ): Promise<void> {
    await this.createVendorService.createVendor(tenantId, createDTO, trx);
  }
}
