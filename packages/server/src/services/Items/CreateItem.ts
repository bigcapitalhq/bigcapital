import { Knex } from 'knex';
import { defaultTo } from 'lodash';
import { Service, Inject } from 'typedi';
import { IItem, IItemDTO, IItemEventCreatedPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { ItemsValidators } from './ItemValidators';

@Service()
export class CreateItem {
  @Inject()
  private validators: ItemsValidators;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Authorize the creating item.
   * @param {number} tenantId
   * @param {IItemDTO} itemDTO
   */
  async authorize(tenantId: number, itemDTO: IItemDTO) {
    // Validate whether the given item name already exists on the storage.
    await this.validators.validateItemNameUniquiness(tenantId, itemDTO.name);

    if (itemDTO.categoryId) {
      await this.validators.validateItemCategoryExistance(
        tenantId,
        itemDTO.categoryId
      );
    }
    if (itemDTO.sellAccountId) {
      await this.validators.validateItemSellAccountExistance(
        tenantId,
        itemDTO.sellAccountId
      );
    }
    if (itemDTO.costAccountId) {
      await this.validators.validateItemCostAccountExistance(
        tenantId,
        itemDTO.costAccountId
      );
    }
    if (itemDTO.inventoryAccountId) {
      await this.validators.validateItemInventoryAccountExistance(
        tenantId,
        itemDTO.inventoryAccountId
      );
    }
  }

  /**
   * Transforms the item DTO to model.
   * @param  {IItemDTO} itemDTO - Item DTO.
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
   * @param {number} tenantId DTO
   * @param {IItemDTO} item
   * @return {Promise<IItem>}
   */
  public async createItem(tenantId: number, itemDTO: IItemDTO): Promise<IItem> {
    const { Item } = this.tenancy.models(tenantId);

    // Authorize the item before creating.
    await this.authorize(tenantId, itemDTO);

    // Creates a new item with associated transactions under unit-of-work environment.
    const item = this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Inserts a new item and fetch the created item.
        const item = await Item.query(trx).insertAndFetch({
          ...this.transformNewItemDTOToModel(itemDTO),
        });
        // Triggers `onItemCreated` event.
        await this.eventPublisher.emitAsync(events.item.onCreated, {
          tenantId,
          item,
          itemId: item.id,
          trx,
        } as IItemEventCreatedPayload);

        return item;
      }
    );
    return item;
  }
}
