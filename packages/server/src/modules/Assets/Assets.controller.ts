import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssetsApplicationService } from './AssetsApplication.service';
import { CreateAssetDto } from './dtos/CreateAsset.dto';
import { EditAssetDto } from './dtos/EditAsset.dto';
import { DisposeAssetDto } from './dtos/DisposeAsset.dto';
import { GetAssetsQueryDto } from './dtos/GetAssetsQuery.dto';
import { BulkDeleteDto } from '@/common/dtos/BulkDelete.dto';
import { ApiCommonHeaders } from '@/decorators/ApiCommonHeaders';
import { AuthorizationGuard } from '@/modules/Auth/Guards/AuthorizationGuard';
import { PermissionGuard } from '@/modules/Auth/Guards/PermissionGuard';
import { RequirePermission } from '@/modules/Auth/Guards/RequirePermission';
import { AbilitySubject, AssetAction } from '@/constants/abilities';

@Controller('assets')
@ApiTags('Assets')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class AssetsController {
  constructor(
    private readonly assetsApplication: AssetsApplicationService,
  ) {}

  @Post()
  @RequirePermission(AssetAction.CREATE, AbilitySubject.Asset)
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  async createAsset(@Body() createAssetDto: CreateAssetDto) {
    const asset = await this.assetsApplication.createAsset(createAssetDto);
    return { asset };
  }

  @Put(':id')
  @RequirePermission(AssetAction.EDIT, AbilitySubject.Asset)
  @ApiOperation({ summary: 'Edit an existing asset' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  async editAsset(
    @Param('id', ParseIntPipe) id: number,
    @Body() editAssetDto: EditAssetDto,
  ) {
    const asset = await this.assetsApplication.editAsset(id, editAssetDto);
    return { asset };
  }

  @Delete(':id')
  @RequirePermission(AssetAction.DELETE, AbilitySubject.Asset)
  @ApiOperation({ summary: 'Delete an asset' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
  async deleteAsset(@Param('id', ParseIntPipe) id: number) {
    await this.assetsApplication.deleteAsset(id);
    return { message: 'Asset deleted successfully' };
  }

  @Post('bulk-delete')
  @HttpCode(200)
  @RequirePermission(AssetAction.DELETE, AbilitySubject.Asset)
  @ApiOperation({ summary: 'Bulk delete assets' })
  async bulkDeleteAssets(@Body() bulkDeleteDto: BulkDeleteDto) {
    await this.assetsApplication.bulkDeleteAssets(bulkDeleteDto.ids);
    return { message: 'Assets deleted successfully' };
  }

  @Get()
  @RequirePermission(AssetAction.VIEW, AbilitySubject.Asset)
  @ApiOperation({ summary: 'Get list of assets' })
  async getAssets(@Query() filterDto: GetAssetsQueryDto) {
    const { assets, filterMeta } = await this.assetsApplication.getAssets(filterDto);
    return { assets, filterMeta };
  }

  @Get(':id')
  @RequirePermission(AssetAction.VIEW, AbilitySubject.Asset)
  @ApiOperation({ summary: 'Get a single asset' })
  async getAsset(@Param('id', ParseIntPipe) id: number) {
    const asset = await this.assetsApplication.getAsset(id);
    return { asset };
  }

  @Post(':id/calculate-depreciation')
  @RequirePermission(AssetAction.EDIT, AbilitySubject.Asset)
  @ApiOperation({ summary: 'Calculate depreciation schedule for an asset' })
  async calculateDepreciation(@Param('id', ParseIntPipe) id: number) {
    await this.assetsApplication.calculateDepreciation(id);
    return { message: 'Depreciation calculated successfully' };
  }

  @Get(':id/depreciation-schedule')
  @RequirePermission(AssetAction.VIEW, AbilitySubject.Asset)
  @ApiOperation({ summary: 'Get depreciation schedule for an asset' })
  async getDepreciationSchedule(@Param('id', ParseIntPipe) id: number) {
    const schedule = await this.assetsApplication.getDepreciationSchedule(id);
    return { schedule };
  }

  @Post(':id/dispose')
  @RequirePermission(AssetAction.EDIT, AbilitySubject.Asset)
  @ApiOperation({ summary: 'Dispose or sell an asset' })
  async disposeAsset(
    @Param('id', ParseIntPipe) id: number,
    @Body() disposeDto: DisposeAssetDto,
  ) {
    const asset = await this.assetsApplication.disposeAsset(id, disposeDto);
    return { asset };
  }
}
