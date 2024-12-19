import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { CommandItemCategoryValidatorService } from './CommandItemCategoryValidator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IItemCategoryEditedPayload,
  IItemCategoryOTD,
} from '../ItemCategory.interfaces';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { Knex } from 'knex';
import { ItemCategory } from '../models/ItemCategory.model';
import { Inject } from '@nestjs/common';

export class EditItemCategoryService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly validator: CommandItemCategoryValidatorService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(ItemCategory.name)
    private readonly itemCategoryModel: typeof ItemCategory,
  ) {}
  /**
   * Edits item category.
   * @param {number} tenantId
   * @param {number} itemCategoryId
   * @param {IItemCategoryOTD} itemCategoryOTD
   * @return {Promise<void>}
   */
  public async editItemCategory(
    itemCategoryId: number,
    itemCategoryOTD: IItemCategoryOTD,
  ): Promise<IItemCategory> {
    // Retrieve the item category from the storage.
    const oldItemCategory = await this.itemCategoryModel
      .query()
      .findById(itemCategoryId)
      .throwIfNotFound();

    // Validate the category name whether unique on the storage.
    await this.validator.validateCategoryNameUniquiness(
      itemCategoryOTD.name,
      itemCategoryId,
    );
    if (itemCategoryOTD.sellAccountId) {
      await this.validator.validateSellAccount(itemCategoryOTD.sellAccountId);
    }
    if (itemCategoryOTD.costAccountId) {
      await this.validator.validateCostAccount(itemCategoryOTD.costAccountId);
    }
    if (itemCategoryOTD.inventoryAccountId) {
      await this.validator.validateInventoryAccount(
        itemCategoryOTD.inventoryAccountId,
      );
    }
    const itemCategoryObj = this.transformOTDToObject(
      itemCategoryOTD,
      authorizedUser,
    );
    //
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      //
      const itemCategory = await ItemCategory.query().patchAndFetchById(
        itemCategoryId,
        { ...itemCategoryObj },
      );
      // Triggers `onItemCategoryEdited` event.
      await this.eventEmitter.emitAsync(events.itemCategory.onEdited, {
        oldItemCategory,
        trx,
      } as IItemCategoryEditedPayload);

      return itemCategory;
    });
  }

  /**
   * Transforms OTD to model object.
   * @param {IItemCategoryOTD} itemCategoryOTD
   * @param {ISystemUser} authorizedUser
   */
  private transformOTDToObject(
    itemCategoryOTD: IItemCategoryOTD,
    authorizedUser: SystemUser,
  ) {
    return { ...itemCategoryOTD, userId: authorizedUser.id };
  }
}
