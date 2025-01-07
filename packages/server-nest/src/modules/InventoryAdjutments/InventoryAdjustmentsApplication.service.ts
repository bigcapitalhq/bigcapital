import { Injectable } from '@nestjs/common';
import { DeleteInventoryAdjustmentService } from './commands/DeleteInventoryAdjustment.service';
import { PublishInventoryAdjustmentService } from './commands/PublishInventoryAdjustment.service';
import { CreateQuickInventoryAdjustmentService } from './commands/CreateQuickInventoryAdjustment.service';
import { IQuickInventoryAdjustmentDTO } from './types/InventoryAdjustments.types';
import { InventoryAdjustment } from './models/InventoryAdjustment';

@Injectable()
export class InventoryAdjustmentsApplicationService {
  constructor(
    private readonly createQuickInventoryAdjustmentService: CreateQuickInventoryAdjustmentService,
    private readonly deleteInventoryAdjustmentService: DeleteInventoryAdjustmentService,
    private readonly publishInventoryAdjustmentService: PublishInventoryAdjustmentService,
  ) {}

  /**
   * Creates a quick inventory adjustment transaction.
   * @param {IQuickInventoryAdjustmentDTO} quickAdjustmentDTO - Quick inventory adjustment DTO.
   */
  public async createQuickInventoryAdjustment(
    quickAdjustmentDTO: IQuickInventoryAdjustmentDTO,
  ): Promise<InventoryAdjustment> {
    return this.createQuickInventoryAdjustmentService.createQuickAdjustment(
      quickAdjustmentDTO,
    );
  }

  /**
   * Deletes the inventory adjustment transaction.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   */
  public async deleteInventoryAdjustment(
    inventoryAdjustmentId: number,
  ): Promise<void> {
    return this.deleteInventoryAdjustmentService.deleteInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }

  /**
   * Publishes the inventory adjustment transaction.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   */
  public async publishInventoryAdjustment(
    inventoryAdjustmentId: number,
  ): Promise<void> {
    return this.publishInventoryAdjustmentService.publishInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }
}
