import { Knex } from 'knex';
import { defaultTo } from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { IItemDTO, IItemEventCreatedPayload } from '@/interfaces/Item';
import { events } from '@/common/events/events';
import { ItemsValidators } from './ItemValidator.service';
import { Item } from './models/Item';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';

@Injectable({ scope: Scope.REQUEST })
export class CreateItemService {
  /**
   * Constructor for the CreateItemService class.
   * @param {EventEmitter2} eventEmitter - Event emitter for publishing item creation events.
   * @param {UnitOfWork} uow - Unit of Work for tenant database transactions.
   * @param {ItemsValidators} validators - Service for validating item data.
   * @param {typeof Item} itemModel - The Item model class for database operations.
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validators: ItemsValidators,

    @Inject(Item.name)
    private readonly itemModel: typeof Item,
  ) {}

  /**
   * Authorize the creating item.
   * @param {number} tenantId
   * @param {IItemDTO} itemDTO
   */
  async authorize(itemDTO: IItemDTO) {
    // Validate whether the given item name already exists on the storage.
    await this.validators.validateItemNameUniquiness(itemDTO.name);

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
   * Transforms the item DTO to model.
   * @param {IItemDTO} itemDTO - Item DTO.
   * @return {IItem}
   */
  private transformNewItemDTOToModel(itemDTO: IItemDTO) {
    return {
      ...itemDTO,
      active: defaultTo(itemDTO.active, 1),
      quantityOnHand: itemDTO.type === 'inventory' ? 0 : null,
    };
  }

  /**
   * Creates a new item.
   * @param {IItemDTO} itemDTO
   * @return {Promise<number>} - The created item id.
   */
  public async createItem(
    itemDTO: IItemDTO,
    trx?: Knex.Transaction,
  ): Promise<number> {
    // Authorize the item before creating.
    await this.authorize(itemDTO);

    // Creates a new item with associated transactions under unit-of-work envirement.
    return this.uow.withTransaction<number>(async (trx: Knex.Transaction) => {
      const itemInsert = this.transformNewItemDTOToModel(itemDTO);

      // Inserts a new item and fetch the created item.
      const item = await this.itemModel.query(trx).insertAndFetch({
        ...itemInsert,
      });
      // Triggers `onItemCreated` event.
      await this.eventEmitter.emitAsync(events.item.onCreated, {
        item,
        itemId: item.id,
        trx,
      } as IItemEventCreatedPayload);

      return item.id;
    }, trx);
  }
}
