import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import {
  IInventoryDetailsQuery,
  IInvetoryItemDetailDOO,
} from './InventoryItemDetails.types';
import { InventoryDetails } from './InventoryItemDetails';
import { InventoryItemDetailsRepository } from './InventoryItemDetailsRepository';
import { InventoryDetailsMetaInjectable } from './InventoryItemDetailsMeta';
import { getInventoryItemDetailsDefaultQuery } from './constant';

@Injectable()
export class InventoryDetailsService {
  constructor(
    private readonly inventoryItemDetailsRepository: InventoryItemDetailsRepository,
    private readonly inventoryDetailsMeta: InventoryDetailsMetaInjectable,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the inventory details report data.
   * @param {IInventoryDetailsQuery} query - Inventory details query.
   * @return {Promise<IInvetoryItemDetailDOO>}
   */
  public async inventoryDetails(
    query: IInventoryDetailsQuery,
  ): Promise<IInvetoryItemDetailDOO> {
    const filter = {
      ...getInventoryItemDetailsDefaultQuery(),
      ...query,
    };
    // Inventory details report mapper.
    const inventoryDetailsInstance = new InventoryDetails(
      filter,
      this.inventoryItemDetailsRepository,
      this.i18n,
    );
    const meta = await this.inventoryDetailsMeta.meta(query);

    return {
      data: inventoryDetailsInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
