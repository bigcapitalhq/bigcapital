import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Vendor } from '../models/Vendor';
import { events } from '@/common/events/events';
import {
  IVendorEventDeletedPayload,
  IVendorEventDeletingPayload,
} from '../types/Vendors.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ERRORS } from '../constants';

@Injectable()
export class DeleteVendorService {
  /**
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {typeof Vendor} contactModel - Vendor model.
   */
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,
    @Inject(Vendor.name) private vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Deletes the given vendor.
   * @param  {number} vendorId
   * @return {Promise<void>}
   */
  public async deleteVendor(vendorId: number, trx?: Knex.Transaction) {
    // Retrieves the old vendor or throw not found service error.
    const query = this.vendorModel().query(trx);
    const oldVendor = await query.findById(vendorId).throwIfNotFound();

    // Triggers `onVendorDeleting` event.
    await this.eventPublisher.emitAsync(events.vendors.onDeleting, {
      vendorId,
      oldVendor,
    } as IVendorEventDeletingPayload);

    // Deletes vendor contact under unit-of-work.
    return this.uow.withTransaction(async (transaction: Knex.Transaction) => {
      // Deletes the vendor contact from the storage.
      await this.vendorModel()
        .query(transaction)
        .findById(vendorId)
        .deleteIfNoRelations({
          type: ERRORS.VENDOR_HAS_TRANSACTIONS,
          message: 'Vendor has associated transactions',
        });
      // Triggers `onVendorDeleted` event.
      await this.eventPublisher.emitAsync(events.vendors.onDeleted, {
        vendorId,
        oldVendor,
        trx: transaction,
      } as IVendorEventDeletedPayload);
    }, trx);
  }
}
