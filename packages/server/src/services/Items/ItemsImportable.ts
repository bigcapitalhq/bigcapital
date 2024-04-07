import { IItemCreateDTO } from '@/interfaces';
import { Importable } from '@/services/Import/Importable';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { CreateItem } from './CreateItem';

@Service()
export class ItemsImportable extends Importable {
  @Inject()
  private createItemService: CreateItem;

  /**
   * Mapps the imported data to create a new item service.
   * @param {number} tenantId
   * @param {ICustomerNewDTO} createDTO
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public async importable(
    tenantId: number,
    createDTO: IItemCreateDTO,
    trx?: Knex.Transaction<any, any[]>,
  ): Promise<void> {
    console.log(createDTO, tenantId, 'XX');
    await this.createItemService.createItem(tenantId, createDTO, trx);
  }

  /**
   * Retrieves the sample data of customers used to download sample sheet.
   */
  public sampleData(): any[] {
    return [];
  }
}
