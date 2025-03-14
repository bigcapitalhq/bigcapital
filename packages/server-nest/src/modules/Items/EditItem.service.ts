import { Knex } from 'knex';
import { Injectable, Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IItemDTO, IItemEventEditedPayload } from '@/interfaces/Item';
import { events } from '@/common/events/events';
import { ItemsValidators } from './ItemValidator.service';
import { Item } from './models/Item';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { EditItemDto } from './dtos/Item.dto';

@Injectable()
export class EditItemService {
  /**
   * Constructor for the class.
   * @param {EventEmitter2} eventEmitter - Event emitter for publishing item edit events.
   * @param {UnitOfWork} uow - Unit of Work for tenant database transactions.
   * @param {ItemsValidators} validators - Service for validating item data.
   * @param {typeof Item} itemModel - The Item model class for database operations.
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: ItemsValidators,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Authorize the editing item.
   * @param {IItemDTO} itemDTO
   * @param {Item} oldItem
   */
  async authorize(itemDTO: EditItemDto, oldItem: Item) {
    // Validate edit item type from inventory type.
    this.validators.validateEditItemFromInventory(itemDTO, oldItem);

    // Validate edit item type to inventory type.
    await this.validators.validateEditItemTypeToInventory(oldItem, itemDTO);

    // Validate whether the given item name already exists on the storage.
    await this.validators.validateItemNameUniquiness(itemDTO.name, oldItem.id);

    if (itemDTO.categoryId) {
      await this.validators.validateItemCategoryExistance(itemDTO.categoryId);
    }
    if (itemDTO.sellAccountId) {
      await this.validators.validateItemSellAccountExistance(
        itemDTO.sellAccountId,
      );
    }
    // Validate the income account id existance if the item is sellable.
    this.validators.validateIncomeAccountExistance(
      itemDTO.sellable,
      itemDTO.sellAccountId,
    );
    if (itemDTO.costAccountId) {
      await this.validators.validateItemCostAccountExistance(
        itemDTO.costAccountId,
      );
    }
    // Validate the cost account id existance if the item is purchasable.
    this.validators.validateCostAccountExistance(
      itemDTO.purchasable,
      itemDTO.costAccountId,
    );
    if (itemDTO.inventoryAccountId) {
      await this.validators.validateItemInventoryAccountExistance(
        itemDTO.inventoryAccountId,
      );
    }
    if (itemDTO.purchaseTaxRateId) {
      await this.validators.validatePurchaseTaxRateExistance(
        itemDTO.purchaseTaxRateId,
      );
    }
    if (itemDTO.sellTaxRateId) {
      await this.validators.validateSellTaxRateExistance(itemDTO.sellTaxRateId);
    }
  }

  /**
   * Transforms the edit item DTO to model.
   * @param {IItemDTO} itemDTO - Item DTO.
   * @param {Item} oldItem - Old item.
   * @return {Partial<Item>}
   */
  private transformEditItemDTOToModel(
    itemDTO: EditItemDto,
    oldItem: Item,
  ): Partial<Item> {
    return {
      ...itemDTO,
      ...(itemDTO.type === 'inventory' && oldItem.type !== 'inventory'
        ? {
            quantityOnHand: 0,
          }
        : {}),
    };
  }

  /**
   * Edits the item metadata.
   * @param {number} itemId - The item id.
   * @param {IItemDTO} itemDTO - The item DTO.
   * @return {Promise<number>} - The updated item id.
   */
  public async editItem(
    itemId: number,
    itemDTO: EditItemDto,
    trx?: Knex.Transaction,
  ): Promise<number> {
    // Validates the given item existance on the storage.
    const oldItem = await this.itemModel()
      .query()
      .findById(itemId)
      .throwIfNotFound();

    // Authorize before editing item.
    await this.authorize(itemDTO, oldItem);

    // Transform the edit item DTO to model.
    const itemModel = this.transformEditItemDTOToModel(itemDTO, oldItem);

    // Edits the item with associated transactions under unit-of-work environment.
    return this.uow.withTransaction<number>(async (trx: Knex.Transaction) => {
      // Updates the item on the storage and fetches the updated one.
      const newItem = await this.itemModel()
        .query(trx)
        .patchAndFetchById(itemId, itemModel);

      // Edit event payload.
      const eventPayload: IItemEventEditedPayload = {
        item: newItem,
        oldItem,
        itemId: newItem.id,
        trx,
      };
      // Triggers `onItemEdited` event.
      await this.eventEmitter.emitAsync(events.item.onEdited, eventPayload);

      return newItem.id;
    }, trx);
  }
}
