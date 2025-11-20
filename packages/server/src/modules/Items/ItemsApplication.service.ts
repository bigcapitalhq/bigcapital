import { Item } from './models/Item';
import { CreateItemService } from './CreateItem.service';
import { DeleteItemService } from './DeleteItem.service';
import { EditItemService } from './EditItem.service';
import { IItem, IItemDTO } from '@/interfaces/Item';
import { Knex } from 'knex';
import { InactivateItem } from './InactivateItem.service';
import { ActivateItemService } from './ActivateItem.service';
import { GetItemService } from './GetItem.service';
import { ItemTransactionsService } from './ItemTransactions.service';
import { Injectable } from '@nestjs/common';
import { GetItemsService } from './GetItems.service';
import { IItemsFilter } from './types/Items.types';
import { EditItemDto, CreateItemDto } from './dtos/Item.dto';
import { GetItemsQueryDto } from './dtos/GetItemsQuery.dto';
import { BulkDeleteItemsService } from './BulkDeleteItems.service';
import { ValidateBulkDeleteItemsService } from './ValidateBulkDeleteItems.service';

@Injectable()
export class ItemsApplicationService {
  constructor(
    private readonly createItemService: CreateItemService,
    private readonly editItemService: EditItemService,
    private readonly deleteItemService: DeleteItemService,
    private readonly activateItemService: ActivateItemService,
    private readonly inactivateItemService: InactivateItem,
    private readonly getItemService: GetItemService,
    private readonly getItemsService: GetItemsService,
    private readonly itemTransactionsService: ItemTransactionsService,
    private readonly bulkDeleteItemsService: BulkDeleteItemsService,
    private readonly validateBulkDeleteItemsService: ValidateBulkDeleteItemsService,
  ) { }

  /**
   * Creates a new item.
   * @param {IItemDTO} createItemDto - The item DTO.
   * @param {Knex.Transaction} [trx] - The transaction.
   * @return {Promise<number>} - The created item id.
   */
  async createItem(
    createItemDto: CreateItemDto,
    trx?: Knex.Transaction,
  ): Promise<number> {
    return this.createItemService.createItem(createItemDto);
  }

  /**
   * Edits an existing item.
   * @param {number} itemId - The item id.
   * @param {IItemDTO} editItemDto - The item DTO.
   * @param {Knex.Transaction} [trx] - The transaction.
   * @return {Promise<number>} - The updated item id.
   */
  async editItem(
    itemId: number,
    editItemDto: EditItemDto,
    trx?: Knex.Transaction,
  ): Promise<number> {
    return this.editItemService.editItem(itemId, editItemDto, trx);
  }

  /**
   * Deletes an existing item.
   * @param {number} itemId - The item id.
   * @return {Promise<void>}
   */
  async deleteItem(itemId: number): Promise<void> {
    return this.deleteItemService.deleteItem(itemId);
  }

  /**
   * Activates an item.
   * @param {number} itemId - The item id.
   * @returns {Promise<void>}
   */
  async activateItem(itemId: number): Promise<void> {
    return this.activateItemService.activateItem(itemId);
  }

  /**
   * Inactivates an item.
   * @param {number} itemId - The item id.
   * @returns {Promise<void>}
   */
  async inactivateItem(itemId: number): Promise<void> {
    return this.inactivateItemService.inactivateItem(itemId);
  }

  /**
   * Retrieves the item details of the given id with associated details.
   * @param {number} itemId - The item id.
   * @returns {Promise<IItem>} - The item details.
   */
  async getItem(itemId: number): Promise<any> {
    return this.getItemService.getItem(itemId);
  }

  /**
   * Retrieves the paginated filterable items list.
   * @param {Partial<IItemsFilter>} filterDTO
   */
  async getItems(filterDTO: Partial<GetItemsQueryDto>) {
    return this.getItemsService.getItems(filterDTO);
  }

  /**
   * Retrieves the item associated invoices transactions.
   * @param {number} itemId
   * @returns {Promise<any>}
   */
  async getItemInvoicesTransactions(itemId: number): Promise<any> {
    return this.itemTransactionsService.getItemInvoicesTransactions(itemId);
  }

  /**
   * Retrieves the item associated bills transactions.
   * @param {number} itemId
   * @returns {Promise<any>}
   */
  async getItemBillTransactions(itemId: number): Promise<any> {
    return this.itemTransactionsService.getItemBillTransactions(itemId);
  }

  /**
   * Retrieves the item associated estimates transactions.
   * @param {number} itemId
   * @returns {Promise<any>}
   */
  async getItemEstimatesTransactions(itemId: number): Promise<any> {
    return this.itemTransactionsService.getItemEstimateTransactions(itemId);
  }

  /**
   * Retrieves the item associated receipts transactions.
   * @param {number} itemId
   * @returns {Promise<any>}
   */
  async getItemReceiptsTransactions(itemId: number): Promise<any> {
    return this.itemTransactionsService.getItemReceiptTransactions(itemId);
  }

  /**
   * Validates which items can be deleted in bulk.
   * @param {number[]} itemIds - Array of item IDs to validate
   * @returns {Promise<{deletableCount: number, nonDeletableCount: number, deletableIds: number[], nonDeletableIds: number[]}>}
   */
  async validateBulkDeleteItems(itemIds: number[]): Promise<{
    deletableCount: number;
    nonDeletableCount: number;
    deletableIds: number[];
    nonDeletableIds: number[];
  }> {
    return this.validateBulkDeleteItemsService.validateBulkDeleteItems(itemIds);
  }

  /**
   * Deletes multiple items in bulk.
   * @param {number[]} itemIds - Array of item IDs to delete
   * @returns {Promise<void>}
   */
  async bulkDeleteItems(
    itemIds: number[],
    options?: { skipUndeletable?: boolean },
  ): Promise<void> {
    return this.bulkDeleteItemsService.bulkDeleteItems(itemIds, options);
  }
}
