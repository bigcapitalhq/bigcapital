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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('inventory-adjustments')
@ApiTags('inventory-adjustments')
@PublicRoute()
export class InventoryAdjustmentsController {
  constructor(
    private readonly inventoryAdjustmentsApplicationService: InventoryAdjustmentsApplicationService,
  ) {}

  @Post('quick')
  @ApiOperation({ summary: 'Create a quick inventory adjustment.' })
  public async createQuickInventoryAdjustment(
    @Body() quickAdjustmentDTO: IQuickInventoryAdjustmentDTO,
  ): Promise<InventoryAdjustment> {
    return this.inventoryAdjustmentsApplicationService.createQuickInventoryAdjustment(
      quickAdjustmentDTO,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given inventory adjustment.' })
  public async deleteInventoryAdjustment(
    @Param('id') inventoryAdjustmentId: number,
  ): Promise<void> {
    return this.inventoryAdjustmentsApplicationService.deleteInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the inventory adjustments.' })
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
  @ApiOperation({ summary: 'Retrieves the inventory adjustment details.' })
  public async getInventoryAdjustment(
    @Param('id') inventoryAdjustmentId: number,
  ): Promise<InventoryAdjustment> {
    return this.inventoryAdjustmentsApplicationService.getInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }

  @Put(':id/publish')
  @ApiOperation({ summary: 'Publish the given inventory adjustment.' })
  public async publishInventoryAdjustment(
    @Param('id') inventoryAdjustmentId: number,
  ): Promise<void> {
    return this.inventoryAdjustmentsApplicationService.publishInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }
}
