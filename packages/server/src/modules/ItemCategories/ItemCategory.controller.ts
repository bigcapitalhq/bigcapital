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
import { ItemCategoryApplication } from './ItemCategory.application';
import {
  GetItemCategoriesResponse,
  IItemCategoriesFilter,
} from './ItemCategory.interfaces';
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
import { ItemCategoryResponseDto } from './dtos/ItemCategoryResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('item-categories')
@ApiTags('Item Categories')
@ApiExtraModels(ItemCategoryResponseDto)
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
    @Query() filterDTO: Partial<IItemCategoriesFilter>,
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given item category.' })
  async deleteItemCategory(@Param('id') id: number) {
    return this.itemCategoryApplication.deleteItemCategory(id);
  }
}
