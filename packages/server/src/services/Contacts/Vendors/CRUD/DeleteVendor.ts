import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import {
  ISystemUser,
  IVendorEventDeletedPayload,
  IVendorEventDeletingPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import UnitOfWork from '@/services/UnitOfWork';
import { ERRORS } from '../constants';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class DeleteVendor {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Deletes the given vendor.
   * @param  {number} tenantId
   * @param  {number} vendorId
   * @return {Promise<void>}
   */
  public async deleteVendor(
    tenantId: number,
    vendorId: number,
    authorizedUser: ISystemUser
  ) {
    const { Contact } = this.tenancy.models(tenantId);

    // Retrieves the old vendor or throw not found service error.
    const oldVendor = await Contact.query()
      .modify('vendor')
      .findById(vendorId)
      .throwIfNotFound()
      .queryAndThrowIfHasRelations({
        type: ERRORS.VENDOR_HAS_TRANSACTIONS,
      });
    // Triggers `onVendorDeleting` event.
    await this.eventPublisher.emitAsync(events.vendors.onDeleting, {
      tenantId,
      vendorId,
      oldVendor,
    } as IVendorEventDeletingPayload);

    // Deletes vendor contact under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Deletes the vendor contact from the storage.
      await Contact.query(trx).findById(vendorId).delete();

      // Triggers `onVendorDeleted` event.
      await this.eventPublisher.emitAsync(events.vendors.onDeleted, {
        tenantId,
        vendorId,
        authorizedUser,
        oldVendor,
        trx,
      } as IVendorEventDeletedPayload);
    });
  }
}
