import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import {
  IVendorCreditEditedPayload,
  IVendorCreditEditingPayload,
} from '../types/VendorCredit.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { VendorCredit } from '../models/VendorCredit';
import { Contact } from '@/modules/Contacts/models/Contact';
import { events } from '@/common/events/events';
import { VendorCreditDTOTransformService } from './VendorCreditDTOTransform.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditVendorCreditDto } from '../dtos/VendorCredit.dto';

@Injectable()
export class EditVendorCreditService {
  /**
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {ItemsEntriesService} itemsEntriesService - The items entries service.
   * @param {typeof VendorCredit} vendorCreditModel - The vendor credit model.
   * @param {typeof Contact} contactModel - The contact model.
   */
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly vendorCreditDTOTransform: VendorCreditDTOTransformService,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: TenantModelProxy<typeof VendorCredit>,

    @Inject(Contact.name)
    private readonly contactModel: TenantModelProxy<typeof Contact>,
  ) {}

  /**
   * Deletes the given vendor credit.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {EditVendorCreditDto} vendorCreditDto -
   */
  public editVendorCredit = async (
    vendorCreditId: number,
    vendorCreditDTO: EditVendorCreditDto,
    trx?: Knex.Transaction,
  ) => {
    // Edits the vendor credit graph under unit-of-work envirement.
    return this.uow.withTransaction(async (trx) => {
      // Validates the edit operation against the locked vendor credit row.
      const { oldVendorCredit, vendorCreditModel } = await this.validate(
        vendorCreditId,
        vendorCreditDTO,
        trx,
      );
      // Triggers `onVendorCreditEditing` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onEditing, {
        oldVendorCredit,
        vendorCreditDTO,
        trx,
      } as IVendorCreditEditingPayload);

      // Saves the vendor credit graph to the storage.
      const vendorCredit = await this.vendorCreditModel()
        .query(trx)
        .upsertGraphAndFetch({
          id: vendorCreditId,
          ...vendorCreditModel,
        });
      // Triggers `onVendorCreditEdited event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onEdited, {
        oldVendorCredit,
        vendorCredit,
        vendorCreditDTO,
        trx,
      } as IVendorCreditEditedPayload);

      return vendorCredit;
    }, trx);
  };

  /**
   * Validates the edit vendor credit operation against the locked vendor
   * credit row: existence, vendor, items entries and the new amount against
   * the already used amounts.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {EditVendorCreditDto} vendorCreditDTO - Vendor credit edit DTO.
   * @param {Knex.Transaction} trx - Locks the vendor credit row (FOR UPDATE).
   * @returns {Promise<{ oldVendorCredit: VendorCredit, vendorCreditModel: VendorCredit }>}
   */
  validate = async (
    vendorCreditId: number,
    vendorCreditDTO: EditVendorCreditDto,
    trx: Knex.Transaction,
  ): Promise<{
    oldVendorCredit: VendorCredit;
    vendorCreditModel: VendorCredit;
  }> => {
    // Retrieve the vendor credit with a row lock or throw not found service error.
    const oldVendorCredit = await this.vendorCreditModel()
      .query(trx)
      .findById(vendorCreditId)
      .forUpdate()
      .throwIfNotFound();

    // Validate customer existance.
    const vendor = await this.contactModel()
      .query(trx)
      .modify('vendor')
      .findById(vendorCreditDTO.vendorId)
      .throwIfNotFound();

    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(
      vendorCreditDTO.entries,
    );
    // Validate non-sellable entries items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      vendorCreditDTO.entries,
    );
    // Validate the items entries existance.
    await this.itemsEntriesService.validateEntriesIdsExistance(
      vendorCreditId,
      'VendorCredit',
      vendorCreditDTO.entries,
    );
    // Transformes edit DTO to model storage layer.
    const vendorCreditModel =
      await this.vendorCreditDTOTransform.transformCreateEditDTOToModel(
        vendorCreditDTO,
        vendor.currencyCode,
        oldVendorCredit,
      );
    // Validate the new amount is not smaller than the already refunded
    // and applied-to-bills amounts against the locked row.
    this.vendorCreditDTOTransform.validateCreditAmountNotBelowUsed(
      oldVendorCredit,
      vendorCreditModel.amount,
    );
    return { oldVendorCredit, vendorCreditModel };
  };
}
