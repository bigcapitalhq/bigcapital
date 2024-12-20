import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ItemCategoryApplication } from './ItemCategory.application';
import { IItemCategoryOTD } from './ItemCategory.interfaces';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('item-categories')
@PublicRoute()
export class ItemCategoryController {
  constructor(
    private readonly itemCategoryApplication: ItemCategoryApplication,
  ) {}

  @Post()
  async createItemCategory(
    @Body('tenantId') tenantId: number,
    @Body() itemCategoryDTO: IItemCategoryOTD,
  ) {
    return this.itemCategoryApplication.createItemCategory(
      tenantId,
      itemCategoryDTO,
    );
  }

  @Put(':id')
  async editItemCategory(
    @Param('id') id: number,
    @Body() itemCategoryDTO: IItemCategoryOTD,
  ) {
    return this.itemCategoryApplication.editItemCategory(id, itemCategoryDTO);
  }

  @Get(':id')
  async getItemCategory(@Param('id') id: number) {
    return this.itemCategoryApplication.getItemCategory(id);
  }

  @Delete(':id')
  async deleteItemCategory(@Param('id') id: number) {
    return this.itemCategoryApplication.deleteItemCategory(id);
  }
}
