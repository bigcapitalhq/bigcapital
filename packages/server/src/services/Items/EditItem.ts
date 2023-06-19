import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import {
  IItem,
  IItemDTO,
  IItemEditDTO,
  IItemEventEditedPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { ItemsValidators } from './ItemValidators';
import events from '@/subscribers/events';

@Service()
export class EditItem {
  @Inject()
  private validators: ItemsValidators;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Authorize the editing item.
   * @param {number} tenantId
   * @param {IItemEditDTO} itemDTO
   * @param {IItem} oldItem
   */
  async authorize(tenantId: number, itemDTO: IItemEditDTO, oldItem: IItem) {
    // Validate edit item type from inventory type.
    this.validators.validateEditItemFromInventory(itemDTO, oldItem);

    // Validate edit item type to inventory type.
    await this.validators.validateEditItemTypeToInventory(
      tenantId,
      oldItem,
      itemDTO
    );
    // Validate whether the given item name already exists on the storage.
    await this.validators.validateItemNameUniquiness(
      tenantId,
      itemDTO.name,
      oldItem.id
    );
    // Validate the item category existence on the storage,
    if (itemDTO.categoryId) {
      await this.validators.validateItemCategoryExistence(
        tenantId,
        itemDTO.categoryId
      );
    }
    // Validate the sell account existence on the storage.
    if (itemDTO.sellAccountId) {
      await this.validators.validateItemSellAccountExistence(
        tenantId,
        itemDTO.sellAccountId
      );
    }
    // Validate the cost account existence on the storage.
    if (itemDTO.costAccountId) {
      await this.validators.validateItemCostAccountExistence(
        tenantId,
        itemDTO.costAccountId
      );
    }
    // Validate the inventory account existence onthe storage.
    if (itemDTO.inventoryAccountId) {
      await this.validators.validateItemInventoryAccountExistence(
        tenantId,
        itemDTO.inventoryAccountId
      );
    }
    // Validate inventory account should be modified in inventory item
    // has inventory transactions.
    await this.validators.validateItemInventoryAccountModified(
      tenantId,
      oldItem,
      itemDTO
    );
  }

  /**
   * Transforms edit item DTO to model.
   * @param {IItemDTO} itemDTO - Item DTO.
   * @param {IItem} oldItem -
   */
  private transformEditItemDTOToModel(itemDTO: IItemDTO, oldItem: IItem) {
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
   * @param {number} tenantId
   * @param {number} itemId
   * @param {IItemDTO} itemDTO
   */
  public async editItem(tenantId: number, itemId: number, itemDTO: IItemDTO) {
    const { Item } = this.tenancy.models(tenantId);

    // Validates the given item existence on the storage.
    const oldItem = await Item.query().findById(itemId).throwIfNotFound();

    // Authorize before editing item.
    await this.authorize(tenantId, itemDTO, oldItem);

    // Transform the edit item DTO to model.
    const itemModel = this.transformEditItemDTOToModel(itemDTO, oldItem);

    // Edits the item with associated transactions under unit-of-work environment.
    const newItem = this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Updates the item on the storage and fetches the updated once.
        const newItem = await Item.query(trx).patchAndFetchById(itemId, {
          ...itemModel,
        });
        // Edit event payload.
        const eventPayload: IItemEventEditedPayload = {
          tenantId,
          item: newItem,
          oldItem,
          itemId: newItem.id,
          trx,
        };
        // Triggers `onItemEdited` event.
        await this.eventPublisher.emitAsync(events.item.onEdited, eventPayload);

        return newItem;
      }
    );

    return newItem;
  }
}
