import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Inject,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WarehouseTransferApplication } from './WarehouseTransferApplication';
import {
  CreateWarehouseTransferDto,
  EditWarehouseTransferDto,
} from './dtos/WarehouseTransfer.dto';
import { GetWarehouseTransfersQueryDto } from '../Warehouses/dtos/GetWarehouseTransfersQuery.dto';

@Controller('warehouse-transfers')
@ApiTags('warehouse-transfers')
export class WarehouseTransfersController {
  /**
   * @param {WarehouseTransferApplication} warehouseTransferApplication - Warehouse transfer application.
   */
  constructor(
    @Inject(WarehouseTransferApplication)
    private readonly warehouseTransferApplication: WarehouseTransferApplication,
  ) {}

  /**
   * Creates a new warehouse transfer transaction.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new warehouse transfer transaction.' })
  @ApiResponse({
    status: 200,
    description:
      'The warehouse transfer transaction has been created successfully.',
  })
  async createWarehouseTransfer(
    @Body() createWarehouseTransferDTO: CreateWarehouseTransferDto,
  ) {
    const warehouse =
      await this.warehouseTransferApplication.createWarehouseTransfer(
        createWarehouseTransferDTO,
      );

    return {
      id: warehouse.id,
      message:
        'The warehouse transfer transaction has been created successfully.',
    };
  }

  /**
   * Edits warehouse transfer transaction.
   */
  @Post(':id')
  @ApiOperation({ summary: 'Edit the given warehouse transfer transaction.' })
  @ApiResponse({
    status: 200,
    description:
      'The warehouse transfer transaction has been edited successfully.',
  })
  async editWarehouseTransfer(
    @Param('id') id: number,
    @Body() editWarehouseTransferDTO: EditWarehouseTransferDto,
  ) {
    const warehouseTransfer =
      await this.warehouseTransferApplication.editWarehouseTransfer(
        id,
        editWarehouseTransferDTO,
      );
    return {
      id: warehouseTransfer.id,
      message:
        'The warehouse transfer transaction has been edited successfully.',
    };
  }

  /**
   * Initiates the warehouse transfer.
   */
  @Put(':id/initiate')
  @ApiOperation({ summary: 'Initiate the given warehouse transfer.' })
  @ApiResponse({
    status: 200,
    description: 'The warehouse transfer has been initiated successfully.',
  })
  async initiateTransfer(@Param('id') id: number) {
    await this.warehouseTransferApplication.initiateWarehouseTransfer(id);

    return {
      id,
      message: 'The given warehouse transfer has been initialized.',
    };
  }

  /**
   * Marks the given warehouse transfer as transferred.
   */
  @Put(':id/transferred')
  @ApiOperation({
    summary: 'Mark the given warehouse transfer as transferred.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The warehouse transfer has been marked as transferred successfully.',
  })
  async deliverTransfer(@Param('id') id: number) {
    await this.warehouseTransferApplication.transferredWarehouseTransfer(id);

    return {
      id,
      message: 'The given warehouse transfer has been delivered.',
    };
  }

  /**
   * Retrieves warehouse transfer transactions with pagination.
   */
  @Get()
  @ApiOperation({
    summary: 'Retrieve warehouse transfer transactions with pagination.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The warehouse transfer transactions have been retrieved successfully.',
  })
  async getWarehousesTransfers(@Query() query: GetWarehouseTransfersQueryDto) {
    const { warehousesTransfers, pagination, filter } =
      await this.warehouseTransferApplication.getWarehousesTransfers(query);

    return {
      data: warehousesTransfers,
      pagination,
      filter,
    };
  }

  /**
   * Retrieves warehouse transfer transaction details.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve warehouse transfer transaction details.' })
  @ApiResponse({
    status: 200,
    description:
      'The warehouse transfer transaction details have been retrieved successfully.',
  })
  async getWarehouseTransfer(@Param('id') id: number) {
    const warehouseTransfer =
      await this.warehouseTransferApplication.getWarehouseTransfer(id);

    return { data: warehouseTransfer };
  }

  /**
   * Deletes the given warehouse transfer transaction.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given warehouse transfer transaction.' })
  @ApiResponse({
    status: 200,
    description:
      'The warehouse transfer transaction has been deleted successfully.',
  })
  async deleteWarehouseTransfer(@Param('id') id: number) {
    await this.warehouseTransferApplication.deleteWarehouseTransfer(id);

    return {
      message:
        'The warehouse transfer transaction has been deleted successfully.',
    };
  }
}
