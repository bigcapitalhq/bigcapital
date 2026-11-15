import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { omit } from 'lodash';
import { Importable } from '../Import/Importable';
import { CreateItemService } from './CreateItem.service';
import { CreateItemDto } from './dtos/Item.dto';
import { ItemsSampleData } from './Items.constants';
import { ImportableService } from '../Import/decorators/Import.decorator';
import { Item } from './models/Item';
import { ItemsSettingsService } from './ItemsSettings.service';

@Injectable()
@ImportableService({ name: Item.name })
export class ItemsImportable extends Importable {
  constructor(
    private readonly createItemService: CreateItemService,
    private readonly itemsSettings: ItemsSettingsService,
  ) {
    super();
  }

  /**
   * Mapps the imported data to create a new item service.
   * @param {CreateItemDto} createDTO
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public async importable(
    createDTO: CreateItemDto,
    trx?: Knex.Transaction<any, any[]>,
  ): Promise<void> {
    await this.createItemService.createItem(createDTO, trx);
  }

  /**
   * Retrieves the sample data of items used to download sample sheet.
   * The SKU column is omitted when the SKU feature is disabled.
   */
  public async sampleData(): Promise<any[]> {
    const { enabled } = await this.itemsSettings.getSkuSettings();

    return enabled
      ? ItemsSampleData
      : ItemsSampleData.map((item) => omit(item, ['SKU']));
  }
}
