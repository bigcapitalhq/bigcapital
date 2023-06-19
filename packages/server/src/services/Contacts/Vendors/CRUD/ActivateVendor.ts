import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { VendorValidators } from './VendorValidators';
import { IVendorActivatedPayload } from '@/interfaces';

@Service()
export class ActivateVendor {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: VendorValidators;

  /**
   * Inactive the given contact.
   * @param   {number} tenantId - Tenant id.
   * @param   {number} contactId - Contact id.
   * @returns {Promise<void>}
   */
  public async activateVendor(
    tenantId: number,
    vendorId: number
  ): Promise<void> {
    const { Contact } = this.tenancy.models(tenantId);

    // Retrieves the old vendor or throw not found error.
    const oldVendor = await Contact.query()
      .findById(vendorId)
      .modify('vendor')
      .throwIfNotFound();

    // Validate whether the vendor is already published.
    this.validators.validateNotAlreadyPublished(oldVendor);

    // Edits the vendor with associated transactions on unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onVendorActivating` event.
      await this.eventPublisher.emitAsync(events.vendors.onActivating, {
        tenantId,
        trx,
        oldVendor,
      } as IVendorActivatedPayload);

      // Updates the vendor on the storage.
      const vendor = await Contact.query(trx).updateAndFetchById(vendorId, {
        active: true,
      });
      // Triggers `onVendorActivated` event.
      await this.eventPublisher.emitAsync(events.vendors.onActivated, {
        tenantId,
        trx,
        oldVendor,
        vendor,
      } as IVendorActivatedPayload);
    });
  }
}
