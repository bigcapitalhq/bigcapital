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
import { ICreateWarehouseDTO, IEditWarehouseDTO } from './Warehouse.types';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('warehouses')
@ApiTags('warehouses')
@PublicRoute()
export class WarehousesController {
  constructor(private warehousesApplication: WarehousesApplication) {}

  @Post()
  createWarehouse(@Body() createWarehouseDTO: ICreateWarehouseDTO) {
    return this.warehousesApplication.createWarehouse(createWarehouseDTO);
  }

  @Put(':id')
  editWarehouse(
    @Param('id') warehouseId: string,
    @Body() editWarehouseDTO: IEditWarehouseDTO,
  ) {
    return this.warehousesApplication.editWarehouse(
      Number(warehouseId),
      editWarehouseDTO,
    );
  }

  @Delete(':id')
  deleteWarehouse(@Param('id') warehouseId: string) {
    return this.warehousesApplication.deleteWarehouse(Number(warehouseId));
  }

  @Get(':id')
  getWarehouse(@Param('id') warehouseId: string) {
    return this.warehousesApplication.getWarehouse(Number(warehouseId));
  }

  @Get()
  getWarehouses() {
    return this.warehousesApplication.getWarehouses();
  }

  @Post('activate')
  activateWarehouses() {
    return this.warehousesApplication.activateWarehouses();
  }

  @Post(':id/mark-primary')
  markWarehousePrimary(@Param('id') warehouseId: string) {
    return this.warehousesApplication.markWarehousePrimary(Number(warehouseId));
  }

  @Get('items/:itemId')
  getItemWarehouses(@Param('itemId') itemId: string) {
    return this.warehousesApplication.getItemWarehouses(Number(itemId));
  }
}
