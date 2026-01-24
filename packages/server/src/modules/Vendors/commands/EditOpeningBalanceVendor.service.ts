import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IVendorOpeningBalanceEditedPayload,
  IVendorOpeningBalanceEditingPayload,
} from '../types/Vendors.types';
import { VendorOpeningBalanceEditDto } from '../dtos/VendorOpeningBalanceEdit.dto';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Vendor } from '../models/Vendor';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class EditOpeningBalanceVendorService {
  /**
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {typeof Vendor} vendorModel - Vendor model.
   */
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Changes the opening balance of the given customer.
   * @param {number} vendorId
   * @param {VendorOpeningBalanceEditDto} openingBalanceEditDTO
   * @returns {Promise<IVendor>}
   */
  public async editOpeningBalance(
    vendorId: number,
    openingBalanceEditDTO: VendorOpeningBalanceEditDto,
  ) {
    // Retrieves the old vendor or throw not found error.
    const oldVendor = await this.vendorModel()
      .query()
      .findById(vendorId)
      .throwIfNotFound();

    // Mutates the customer opening balance under unit-of-work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onVendorOpeingBalanceChanging` event.
      await this.eventPublisher.emitAsync(
        events.vendors.onOpeningBalanceChanging,
        {
          oldVendor,
          openingBalanceEditDTO,
          trx,
        } as IVendorOpeningBalanceEditingPayload,
      );

      // Mutates the vendor on the storage.
      const vendor = await this.vendorModel()
        .query()
        .patchAndFetchById(vendorId, {
          ...openingBalanceEditDTO,
        });

      // Triggers `onVendorOpeingBalanceChanged` event.
      await this.eventPublisher.emitAsync(
        events.vendors.onOpeningBalanceChanged,
        {
          vendor,
          oldVendor,
          openingBalanceEditDTO,
          trx,
        } as IVendorOpeningBalanceEditedPayload,
      );

      return vendor;
    });
  }
}
