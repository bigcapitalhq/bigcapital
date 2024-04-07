import {
  IVendorOpeningBalanceEditDTO,
  IVendorOpeningBalanceEditedPayload,
  IVendorOpeningBalanceEditingPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class EditOpeningBalanceVendor {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Changes the opening balance of the given customer.
   * @param   {number} tenantId
   * @param   {number} customerId
   * @param   {number} openingBalance
   * @param   {string|Date} openingBalanceAt
   * @returns {Promise<IVendor>}
   */
  public async editOpeningBalance(
    tenantId: number,
    vendorId: number,
    openingBalanceEditDTO: IVendorOpeningBalanceEditDTO,
  ) {
    const { Vendor } = this.tenancy.models(tenantId);

    // Retrieves the old vendor or throw not found error.
    const oldVendor = await Vendor.query().findById(vendorId).throwIfNotFound();

    // Mutates the customer opening balance under unit-of-work.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onVendorOpeingBalanceChanging` event.
      await this.eventPublisher.emitAsync(events.vendors.onOpeningBalanceChanging, {
        tenantId,
        oldVendor,
        openingBalanceEditDTO,
        trx,
      } as IVendorOpeningBalanceEditingPayload);
      // Mutates the vendor on the storage.
      const vendor = await Vendor.query().patchAndFetchById(vendorId, {
        ...openingBalanceEditDTO,
      });
      // Triggers `onVendorOpeingBalanceChanged` event.
      await this.eventPublisher.emitAsync(events.vendors.onOpeningBalanceChanged, {
        tenantId,
        vendor,
        oldVendor,
        openingBalanceEditDTO,
        trx,
      } as IVendorOpeningBalanceEditedPayload);
      return vendor;
    });
  }
}
