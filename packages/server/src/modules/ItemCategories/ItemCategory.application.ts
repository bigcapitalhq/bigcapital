import { Injectable } from '@nestjs/common';
import {
  IItemCategoriesFilter,
  IItemCategoryOTD,
} from './ItemCategory.interfaces';
import { CreateItemCategoryService } from './commands/CreateItemCategory.service';
import { DeleteItemCategoryService } from './commands/DeleteItemCategory.service';
import { EditItemCategoryService } from './commands/EditItemCategory.service';
import { GetItemCategoryService } from './queries/GetItemCategory.service';
import { GetItemCategoriesService } from './queries/GetItemCategories.service';
import { CreateItemCategoryDto, EditItemCategoryDto } from './dtos/ItemCategory.dto';
import { Knex } from 'knex';

@Injectable()
export class ItemCategoryApplication {
  /**
   * @param {CreateItemCategoryService} createItemCategoryService - Create item category service.
   * @param {EditItemCategoryService} editItemCategoryService - Edit item category service.
   * @param {GetItemCategoryService} getItemCategoryService - Get item category service.
   * @param {DeleteItemCategoryService} deleteItemCategoryService - Delete item category service.
   */
  constructor(
    private readonly createItemCategoryService: CreateItemCategoryService,
    private readonly editItemCategoryService: EditItemCategoryService,
    private readonly getItemCategoryService: GetItemCategoryService,
    private readonly deleteItemCategoryService: DeleteItemCategoryService,
    private readonly getItemCategoriesService: GetItemCategoriesService,
  ) {}

  /**
   * Creates a new item category.
   * @param {IItemCategoryOTD} itemCategoryDTO - The item category data.
   * @returns {Promise<ItemCategory>} The created item category.
   */
  public createItemCategory(
    itemCategoryDTO: CreateItemCategoryDto,
    trx?: Knex.Transaction,
  ) {
    return this.createItemCategoryService.newItemCategory(itemCategoryDTO, trx);
  }

  /**
   * Updates an existing item category.
   * @param {number} itemCategoryId - The item category id to update.
   * @param {IItemCategoryOTD} itemCategoryDTO - The updated item category data.
   * @returns {Promise<ItemCategory>} The updated item category.
   */
  public editItemCategory(
    itemCategoryId: number,
    itemCategoryDTO: EditItemCategoryDto,
  ) {
    return this.editItemCategoryService.editItemCategory(
      itemCategoryId,
      itemCategoryDTO,
    );
  }

  /**
   * Retrieves an item category by id.
   * @param {number} itemCategoryId - The item category id to retrieve.
   * @returns {Promise<ItemCategory>} The requested item category.
   */
  public getItemCategory(itemCategoryId: number) {
    return this.getItemCategoryService.getItemCategory(itemCategoryId);
  }

  /**
   * Deletes an item category.
   * @param {number} itemCategoryId - The item category id to delete.
   * @returns {Promise<void>}
   */
  public deleteItemCategory(itemCategoryId: number) {
    return this.deleteItemCategoryService.deleteItemCategory(itemCategoryId);
  }

  /**
   * Retrieves the item categories list.
   * @param {IItemCategoriesFilter} filterDTO - The item categories filter DTO.
   * @returns {Promise<GetItemCategoriesResponse>}
   */
  public getItemCategories(filterDTO: Partial<IItemCategoriesFilter>) {
    return this.getItemCategoriesService.getItemCategories(filterDTO);
  }
}
