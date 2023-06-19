import {
  ISystemUser,
  IVendorEditDTO,
  IVendorEventEditedPayload,
  IVendorEventEditingPayload,
} from '@/interfaces';
import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { CreateEditVendorDTO } from './CreateEditVendorDTO';

@Service()
export class EditVendor {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private transformDTO: CreateEditVendorDTO;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Edits details of the given vendor.
   * @param   {number} tenantId -
   * @param   {number} vendorId -
   * @param   {IVendorEditDTO} vendorDTO -
   * @returns {Promise<IVendor>}
   */
  public async editVendor(
    tenantId: number,
    vendorId: number,
    vendorDTO: IVendorEditDTO,
    authorizedUser: ISystemUser
  ) {
    const { Contact } = this.tenancy.models(tenantId);

    // Retrieve the vendor or throw not found error.
    const oldVendor = await Contact.query()
      .findById(vendorId)
      .modify('vendor')
      .throwIfNotFound();

    // Transformes vendor DTO to object.
    const vendorObj = this.transformDTO.transformEditDTO(vendorDTO);

    // Edits vendor contact under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onVendorEditing` event.
      await this.eventPublisher.emitAsync(events.vendors.onEditing, {
        trx,
        tenantId,
        vendorDTO,
      } as IVendorEventEditingPayload);

      // Edits the vendor contact.
      const vendor = await Contact.query().updateAndFetchById(vendorId, {
        ...vendorObj,
      });
      // Triggers `onVendorEdited` event.
      await this.eventPublisher.emitAsync(events.vendors.onEdited, {
        tenantId,
        vendorId,
        vendor,
        authorizedUser,
        trx,
      } as IVendorEventEditedPayload);

      return vendor;
    });
  }
}
