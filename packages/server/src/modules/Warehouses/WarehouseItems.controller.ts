import { Controller, Get, Param } from '@nestjs/common';
import { WarehousesApplication } from './WarehousesApplication.service';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('items')
@ApiTags('Warehouses')
@ApiCommonHeaders()
export class WarehouseItemsController {
  constructor(private warehousesApplication: WarehousesApplication) { }

  @Get(':id/warehouses')
  @ApiOperation({
    summary: 'Retrieves the item associated warehouses.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated warehouses have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  getItemWarehouses(@Param('id') itemId: string) {
    return this.warehousesApplication.getItemWarehouses(Number(itemId));
  }
}

