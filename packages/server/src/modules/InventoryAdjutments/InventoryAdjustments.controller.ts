import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryAdjustmentsApplicationService } from './InventoryAdjustmentsApplication.service';
import { IInventoryAdjustmentsFilter } from './types/InventoryAdjustments.types';
import { InventoryAdjustment } from './models/InventoryAdjustment';
import { CreateQuickInventoryAdjustmentDto } from './dtos/CreateQuickInventoryAdjustment.dto';
import { InventoryAdjustmentsFilterDto } from './dtos/InventoryAdjustmentsFilter.dto';
import { InventoryAdjustmentsListResponseDto } from './dtos/InventoryAdjustmentsListResponse.dto';
import { InventoryAdjustmentResponseDto } from './dtos/InventoryAdjustmentResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { InventoryAdjustmentAction } from './types/InventoryAdjustments.types';

@Controller('inventory-adjustments')
@ApiTags('Inventory Adjustments')
@ApiExtraModels(InventoryAdjustmentResponseDto)
@ApiExtraModels(InventoryAdjustmentsListResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class InventoryAdjustmentsController {
  constructor(
    private readonly inventoryAdjustmentsApplicationService: InventoryAdjustmentsApplicationService,
  ) {}

  @Post('quick')
  @RequirePermission(
    InventoryAdjustmentAction.CREATE,
    AbilitySubject.InventoryAdjustment,
  )
  @ApiOperation({ summary: 'Create a quick inventory adjustment.' })
  @ApiResponse({
    status: 200,
    description: 'The inventory adjustment has been successfully created.',
  })
  public async createQuickInventoryAdjustment(
    @Body() quickAdjustmentDTO: CreateQuickInventoryAdjustmentDto,
  ): Promise<InventoryAdjustment> {
    return this.inventoryAdjustmentsApplicationService.createQuickInventoryAdjustment(
      quickAdjustmentDTO,
    );
  }

  @Delete(':id')
  @RequirePermission(
    InventoryAdjustmentAction.DELETE,
    AbilitySubject.InventoryAdjustment,
  )
  @ApiOperation({ summary: 'Delete the given inventory adjustment.' })
  @ApiResponse({
    status: 200,
    description: 'The inventory adjustment has been successfully deleted.',
  })
  public async deleteInventoryAdjustment(
    @Param('id') inventoryAdjustmentId: number,
  ): Promise<void> {
    return this.inventoryAdjustmentsApplicationService.deleteInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }

  @Get()
  @RequirePermission(
    InventoryAdjustmentAction.VIEW,
    AbilitySubject.InventoryAdjustment,
  )
  @ApiOperation({ summary: 'Retrieves the inventory adjustments.' })
  @ApiResponse({
    status: 200,
    description: 'The inventory adjustments have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(InventoryAdjustmentsListResponseDto),
    },
  })
  public async getInventoryAdjustments(
    @Query() filterDTO: InventoryAdjustmentsFilterDto,
  ) {
    return this.inventoryAdjustmentsApplicationService.getInventoryAdjustments(
      filterDTO as IInventoryAdjustmentsFilter,
    );
  }

  @Get(':id')
  @RequirePermission(
    InventoryAdjustmentAction.VIEW,
    AbilitySubject.InventoryAdjustment,
  )
  @ApiOperation({ summary: 'Retrieves the inventory adjustment details.' })
  @ApiResponse({
    status: 200,
    description:
      'The inventory adjustment details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(InventoryAdjustmentResponseDto) },
  })
  public async getInventoryAdjustment(
    @Param('id') inventoryAdjustmentId: number,
  ): Promise<InventoryAdjustment> {
    return this.inventoryAdjustmentsApplicationService.getInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }

  @Put(':id/publish')
  @RequirePermission(
    InventoryAdjustmentAction.EDIT,
    AbilitySubject.InventoryAdjustment,
  )
  @ApiOperation({ summary: 'Publish the given inventory adjustment.' })
  @ApiResponse({
    status: 200,
    description: 'The inventory adjustment has been successfully published.',
  })
  public async publishInventoryAdjustment(
    @Param('id') inventoryAdjustmentId: number,
  ): Promise<void> {
    return this.inventoryAdjustmentsApplicationService.publishInventoryAdjustment(
      inventoryAdjustmentId,
    );
  }
}
