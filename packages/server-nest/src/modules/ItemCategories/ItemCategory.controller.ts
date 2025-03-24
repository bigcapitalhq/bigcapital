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
import { PublicRoute } from '../Auth/Jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateItemCategoryDto,
  EditItemCategoryDto,
} from './dtos/ItemCategory.dto';

@Controller('item-categories')
@ApiTags('item-categories')
@PublicRoute()
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
  async getItemCategories(
    @Query() filterDTO: IItemCategoriesFilter,
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
  async getItemCategory(@Param('id') id: number) {
    return this.itemCategoryApplication.getItemCategory(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given item category.' })
  async deleteItemCategory(@Param('id') id: number) {
    return this.itemCategoryApplication.deleteItemCategory(id);
  }
}
