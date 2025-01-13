import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InventoryAdjustmentsApplicationService } from './InventoryAdjustmentsApplication.service';
import {
  IInventoryAdjustmentsFilter,
  IQuickInventoryAdjustmentDTO,
} from './types/InventoryAdjustments.types';
import { InventoryAdjustment } from './models/InventoryAdjustment';
import { PublicRoute } from '../Auth/Jwt.guard';
import { IPaginationMeta } from '@/interfaces/Model';

@Controller('inventory-adjustments')
@PublicRoute()
export class InventoryAdjustmentsController {
  constructor(
    private readonly inventoryAdjustmentsApplicationService: InventoryAdjustmentsApplicationService,
  ) {}

  @Post('quick')
  public async createQuickInventoryAdjustment(
    @Body() quickAdjustmentDTO: IQuickInventoryAdjustmentDTO,
  ): Promise<InventoryAdjustment> {
    return this.inventoryAdjustmentsApplicationService.createQuickInventoryAdjustment(
      quickAdjustmentDTO,
    );
  }

  @Delete(':id')
  public async deleteInventoryAdjustment(
    @Param('id') inventoryAdjustmentId: number,
  ): Promise<void> {
    return this.inventoryAdjustmentsApplicationService.deleteInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }

  @Get()
  public async getInventoryAdjustments(
    @Query() filterDTO: IInventoryAdjustmentsFilter,
  ): Promise<{
    inventoryAdjustments: InventoryAdjustment[];
    pagination: IPaginationMeta;
  }> {
    return this.inventoryAdjustmentsApplicationService.getInventoryAdjustments(
      filterDTO,
    );
  }

  @Get(':id')
  public async getInventoryAdjustment(
    @Param('id') inventoryAdjustmentId: number,
  ): Promise<InventoryAdjustment> {
    return this.inventoryAdjustmentsApplicationService.getInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }

  @Put(':id/publish')
  public async publishInventoryAdjustment(
    @Param('id') inventoryAdjustmentId: number,
  ): Promise<void> {
    return this.inventoryAdjustmentsApplicationService.publishInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }
}
