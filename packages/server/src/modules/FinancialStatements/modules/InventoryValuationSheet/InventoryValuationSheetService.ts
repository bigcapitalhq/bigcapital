import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IInventoryValuationReportQuery,
  IInventoryValuationSheet,
} from './InventoryValuationSheet.types';
import { InventoryValuationMetaInjectable } from './InventoryValuationSheetMeta';
import { getInventoryValuationDefaultQuery } from './_constants';
import { InventoryCostLotTracker } from '@/modules/InventoryCost/models/InventoryCostLotTracker';
import { Item } from '@/modules/Items/models/Item';
import { InventoryValuationSheetRepository } from './InventoryValuationSheetRepository';
import { InventoryValuationSheet } from './InventoryValuationSheet';

@Injectable()
export class InventoryValuationSheetService {
  constructor(
    private readonly inventoryValuationMeta: InventoryValuationMetaInjectable,
    private readonly eventPublisher: EventEmitter2,
    private readonly inventoryValuationSheetRepository: InventoryValuationSheetRepository,
  ) { }

  /**
   * Inventory valuation sheet.
   * @param {IInventoryValuationReportQuery} query - Valuation query.
   */
  public async inventoryValuationSheet(
    query: IInventoryValuationReportQuery,
  ): Promise<IInventoryValuationSheet> {
    const filter = {
      ...getInventoryValuationDefaultQuery(),
      ...query,
    };
    this.inventoryValuationSheetRepository.setFilter(filter);
    await this.inventoryValuationSheetRepository.asyncInit();

    const inventoryValuationInstance = new InventoryValuationSheet(
      filter,
      this.inventoryValuationSheetRepository,
    );
    // Retrieve the inventory valuation report data.
    const inventoryValuationData = inventoryValuationInstance.reportData();

    // Retrieves the inventorty valuation meta.
    const meta = await this.inventoryValuationMeta.meta(filter);

    // Triggers `onInventoryValuationViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onInventoryValuationViewed,
      { query },
    );

    return {
      data: inventoryValuationData,
      query: filter,
      meta,
    };
  }
}
