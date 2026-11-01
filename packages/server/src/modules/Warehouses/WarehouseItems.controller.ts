import { Controller, Get, Param } from '@nestjs/common';
import { WarehousesApplication } from './WarehousesApplication.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { ItemWarehousesResponseDto } from './Items/dtos/ItemWarehousesResponse.dto';

@Controller('items')
@ApiTags('Warehouses')
@ApiCommonHeaders()
@ApiExtraModels(ItemWarehousesResponseDto)
export class WarehouseItemsController {
  constructor(private warehousesApplication: WarehousesApplication) {}

  @Get(':id/warehouses')
  @ApiOperation({
    summary: 'Retrieves the item associated warehouses.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated warehouses have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ItemWarehousesResponseDto) },
    },
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
