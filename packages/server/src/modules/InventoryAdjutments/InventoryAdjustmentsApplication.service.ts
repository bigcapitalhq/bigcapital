import { Injectable } from '@nestjs/common';
import { DeleteInventoryAdjustmentService } from './commands/DeleteInventoryAdjustment.service';
import { PublishInventoryAdjustmentService } from './commands/PublishInventoryAdjustment.service';
import { CreateQuickInventoryAdjustmentService } from './commands/CreateQuickInventoryAdjustment.service';
import {
  IInventoryAdjustmentsFilter,
  IQuickInventoryAdjustmentDTO,
} from './types/InventoryAdjustments.types';
import { InventoryAdjustment } from './models/InventoryAdjustment';
import { GetInventoryAdjustmentService } from './queries/GetInventoryAdjustment.service';
import { GetInventoryAdjustmentsService } from './queries/GetInventoryAdjustments.service';
import { IPaginationMeta } from '@/interfaces/Model';
import { CreateQuickInventoryAdjustmentDto } from './dtos/CreateQuickInventoryAdjustment.dto';

@Injectable()
export class InventoryAdjustmentsApplicationService {
  constructor(
    private readonly createQuickInventoryAdjustmentService: CreateQuickInventoryAdjustmentService,
    private readonly deleteInventoryAdjustmentService: DeleteInventoryAdjustmentService,
    private readonly publishInventoryAdjustmentService: PublishInventoryAdjustmentService,
    private readonly getInventoryAdjustmentService: GetInventoryAdjustmentService,
    private readonly getInventoryAdjustmentsService: GetInventoryAdjustmentsService,
  ) {}

  /**
   * Retrieves the inventory adjustment transaction.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   * @returns {Promise<InventoryAdjustment>}
   */
  public async getInventoryAdjustment(
    inventoryAdjustmentId: number,
  ): Promise<InventoryAdjustment> {
    return this.getInventoryAdjustmentService.getInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }

  /**
   * Creates a quick inventory adjustment transaction.
   * @param {IQuickInventoryAdjustmentDTO} quickAdjustmentDTO - Quick inventory adjustment DTO.
   */
  public async createQuickInventoryAdjustment(
    quickAdjustmentDTO: CreateQuickInventoryAdjustmentDto,
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

  /**
   * Retrieves the inventory adjustments paginated list.
   * @param {IInventoryAdjustmentsFilter} adjustmentsFilter - Inventory adjustments filter.
   */
  public async getInventoryAdjustments(
    filterDTO: IInventoryAdjustmentsFilter,
  ): Promise<{
    inventoryAdjustments: InventoryAdjustment[];
    pagination: IPaginationMeta;
  }> {
    return this.getInventoryAdjustmentsService.getInventoryAdjustments(
      filterDTO,
    );
  }
}
