import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { Importable } from '@/services/Import/Importable';
import { IItemCreateDTO } from '@/interfaces';
import { CreateItem } from './CreateItem';
import { ItemsSampleData } from './constants';

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
    trx?: Knex.Transaction<any, any[]>
  ): Promise<void> {
    await this.createItemService.createItem(tenantId, createDTO, trx);
  }

  /**
   * Retrieves the sample data of customers used to download sample sheet.
   */
  public sampleData(): any[] {
    return ItemsSampleData;
  }
}
