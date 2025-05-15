import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { CommandItemCategoryValidatorService } from './CommandItemCategoryValidator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  IItemCategoryEditedPayload,
  IItemCategoryOTD,
} from '../ItemCategory.interfaces';
import { SystemUser } from '@/modules/System/models/SystemUser';
import { ItemCategory } from '../models/ItemCategory.model';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditItemCategoryDto } from '../dtos/ItemCategory.dto';

@Injectable()
export class EditItemCategoryService {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {CommandItemCategoryValidatorService} validator - Command item category validator service.
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {TenancyContext} tenancyContext - Tenancy context.
   * @param {typeof ItemCategory} itemCategoryModel - Item category model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly validator: CommandItemCategoryValidatorService,
    private readonly eventEmitter: EventEmitter2,
    private readonly tenancyContext: TenancyContext,

    @Inject(ItemCategory.name)
    private readonly itemCategoryModel: TenantModelProxy<typeof ItemCategory>,
  ) {}

  /**
   * Edits item category.
   * @param {number} itemCategoryId - Item category id.
   * @param {EditItemCategoryDto} itemCategoryOTD - Item category OTD.
   * @return {Promise<ItemCategory>}
   */
  public async editItemCategory(
    itemCategoryId: number,
    itemCategoryOTD: EditItemCategoryDto,
  ): Promise<ItemCategory> {
    // Retrieve the item category from the storage.
    const oldItemCategory = await this.itemCategoryModel()
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
    // Retrieves the authorized user.
    const authorizedUser = await this.tenancyContext.getSystemUser();

    const itemCategoryObj = this.transformOTDToObject(
      itemCategoryOTD,
      authorizedUser,
    );
    // Creates item category under unit-of-work evnirement.
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
   * @param {EditItemCategoryDto} itemCategoryOTD
   * @param {SystemUser} authorizedUser
   */
  private transformOTDToObject(
    itemCategoryOTD: EditItemCategoryDto,
    authorizedUser: SystemUser,
  ) {
    return { ...itemCategoryOTD, userId: authorizedUser.id };
  }
}
