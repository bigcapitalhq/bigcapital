import { Injectable } from '@nestjs/common';
import { IItemCategoryOTD } from './ItemCategory.interfaces';
import { CreateItemCategoryService } from './commands/CreateItemCategory.service';
import { DeleteItemCategoryService } from './commands/DeleteItemCategory.service';
import { EditItemCategoryService } from './commands/EditItemCategory.service';
import { GetItemCategoryService } from './queries/GetItemCategory.service';

@Injectable()
export class ItemCategoryApplication {
  constructor(
    private readonly createItemCategoryService: CreateItemCategoryService,
    private readonly editItemCategoryService: EditItemCategoryService,
    private readonly getItemCategoryService: GetItemCategoryService,
    private readonly deleteItemCategoryService: DeleteItemCategoryService,
  ) {}

  /**
   * Creates a new item category.
   * @param {number} tenantId - The tenant id.
   * @param {IItemCategoryOTD} itemCategoryDTO - The item category data.
   * @returns {Promise<ItemCategory>} The created item category.
   */
  public createItemCategory(
    tenantId: number,
    itemCategoryDTO: IItemCategoryOTD,
  ) {
    return this.createItemCategoryService.newItemCategory(
      tenantId,
      itemCategoryDTO,
    );
  }

  /**
   * Updates an existing item category.
   * @param {number} itemCategoryId - The item category id to update.
   * @param {IItemCategoryOTD} itemCategoryDTO - The updated item category data.
   * @returns {Promise<ItemCategory>} The updated item category.
   */
  public editItemCategory(
    itemCategoryId: number,
    itemCategoryDTO: IItemCategoryOTD,
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
}
