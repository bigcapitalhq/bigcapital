import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WarehousesApplication } from './WarehousesApplication.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWarehouseDto, EditWarehouseDto } from './dtos/Warehouse.dto';

@Controller('warehouses')
@ApiTags('warehouses')
export class WarehousesController {
  constructor(private warehousesApplication: WarehousesApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a warehouse' })
  createWarehouse(@Body() createWarehouseDTO: CreateWarehouseDto) {
    return this.warehousesApplication.createWarehouse(createWarehouseDTO);
  }

  @Put(':id')
  editWarehouse(
    @Param('id') warehouseId: string,
    @Body() editWarehouseDTO: EditWarehouseDto,
  ) {
    return this.warehousesApplication.editWarehouse(
      Number(warehouseId),
      editWarehouseDTO,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warehouse' })
  deleteWarehouse(@Param('id') warehouseId: string) {
    return this.warehousesApplication.deleteWarehouse(Number(warehouseId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a warehouse' })
  getWarehouse(@Param('id') warehouseId: string) {
    return this.warehousesApplication.getWarehouse(Number(warehouseId));
  }

  @Get()
  @ApiOperation({ summary: 'Get all warehouses' })
  getWarehouses() {
    return this.warehousesApplication.getWarehouses();
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate a warehouse' })
  activateWarehouses() {
    return this.warehousesApplication.activateWarehouses();
  }

  @Put(':id/mark-primary')
  @ApiOperation({ summary: 'Mark a warehouse as primary' })
  markWarehousePrimary(@Param('id') warehouseId: string) {
    return this.warehousesApplication.markWarehousePrimary(Number(warehouseId));
  }

  @Get('items/:itemId')
  @ApiOperation({ summary: 'Get item warehouses' })
  getItemWarehouses(@Param('itemId') itemId: string) {
    return this.warehousesApplication.getItemWarehouses(Number(itemId));
  }
}
