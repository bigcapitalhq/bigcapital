import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { VendorValidators } from './VendorValidators';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Vendor } from '../models/Vendor';
import { events } from '@/common/events/events';
import { IVendorActivatedPayload } from '../types/Vendors.types';

@Injectable()
export class ActivateVendorService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly validators: VendorValidators,

    @Inject(Vendor.name)
    private readonly vendorModel: typeof Vendor,
  ) {}

  /**
   * Inactive the given contact.
   * @param {number} vendorId - Vendor id.
   * @returns {Promise<void>}
   */
  public async activateVendor(vendorId: number): Promise<void> {
    // Retrieves the old vendor or throw not found error.
    const oldVendor = await this.vendorModel
      .query()
      .findById(vendorId)
      .throwIfNotFound();

    // Validate whether the vendor is already published.
    this.validators.validateNotAlreadyPublished(oldVendor);

    // Edits the vendor with associated transactions on unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onVendorActivating` event.
      await this.eventPublisher.emitAsync(events.vendors.onActivating, {
        trx,
        oldVendor,
      } as IVendorActivatedPayload);

      // Updates the vendor on the storage.
      const vendor = await this.vendorModel
        .query(trx)
        .updateAndFetchById(vendorId, {
          active: true,
        });
      // Triggers `onVendorActivated` event.
      await this.eventPublisher.emitAsync(events.vendors.onActivated, {
        trx,
        oldVendor,
        vendor,
      } as IVendorActivatedPayload);
    });
  }
}
