import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ItemCategoryApplication } from './ItemCategory.application';
import { GetItemCategoriesResponse } from './ItemCategory.interfaces';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CreateItemCategoryDto,
  EditItemCategoryDto,
} from './dtos/ItemCategory.dto';
import { GetItemCategoriesQueryDto } from './dtos/GetItemCategoriesQuery.dto';
import { ItemCategoryResponseDto } from './dtos/ItemCategoryResponse.dto';
import {
  BulkDeleteItemCategoriesDto,
  ValidateBulkDeleteItemCategoriesResponseDto,
} from './dtos/BulkDeleteItemCategories.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('item-categories')
@ApiTags('Item Categories')
@ApiExtraModels(ItemCategoryResponseDto)
@ApiExtraModels(ValidateBulkDeleteItemCategoriesResponseDto)
@ApiCommonHeaders()
export class ItemCategoryController {
  constructor(
    private readonly itemCategoryApplication: ItemCategoryApplication,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item category.' })
  async createItemCategory(@Body() itemCategoryDTO: CreateItemCategoryDto) {
    return this.itemCategoryApplication.createItemCategory(itemCategoryDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the item categories.' })
  @ApiResponse({
    status: 200,
    description: 'The item categories have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ItemCategoryResponseDto) },
    },
  })
  async getItemCategories(
    @Query() filterDTO: GetItemCategoriesQueryDto,
  ): Promise<GetItemCategoriesResponse> {
    return this.itemCategoryApplication.getItemCategories(filterDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given item category.' })
  async editItemCategory(
    @Param('id') id: number,
    @Body() itemCategoryDTO: EditItemCategoryDto,
  ) {
    return this.itemCategoryApplication.editItemCategory(id, itemCategoryDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the item category details.' })
  @ApiResponse({
    status: 200,
    description: 'The item category details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(ItemCategoryResponseDto) },
  })
  async getItemCategory(@Param('id') id: number) {
    return this.itemCategoryApplication.getItemCategory(id);
  }

  @Post('validate-bulk-delete')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Validates which item categories can be deleted and returns counts of deletable and non-deletable item categories.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed. Returns counts and IDs of deletable and non-deletable item categories.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteItemCategoriesResponseDto),
    },
  })
  async validateBulkDeleteItemCategories(
    @Body() bulkDeleteDto: BulkDeleteItemCategoriesDto,
  ): Promise<ValidateBulkDeleteItemCategoriesResponseDto> {
    return this.itemCategoryApplication.validateBulkDeleteItemCategories(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @HttpCode(200)
  @ApiOperation({ summary: 'Deletes multiple item categories in bulk.' })
  @ApiResponse({
    status: 200,
    description: 'The item categories have been successfully deleted.',
  })
  async bulkDeleteItemCategories(
    @Body() bulkDeleteDto: BulkDeleteItemCategoriesDto,
  ): Promise<void> {
    return this.itemCategoryApplication.bulkDeleteItemCategories(
      bulkDeleteDto.ids,
      { skipUndeletable: bulkDeleteDto.skipUndeletable ?? false },
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given item category.' })
  async deleteItemCategory(@Param('id') id: number) {
    return this.itemCategoryApplication.deleteItemCategory(id);
  }
}
