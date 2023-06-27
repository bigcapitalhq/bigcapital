import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import {
  ISystemUser,
  IVendorEventCreatedPayload,
  IVendorEventCreatingPayload,
  IVendorNewDTO,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CreateEditVendorDTO } from './CreateEditVendorDTO';

@Service()
export class CreateVendor {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformDTO: CreateEditVendorDTO;

  /**
   * Creates a new vendor.
   * @param  {number} tenantId
   * @param  {IVendorNewDTO} vendorDTO
   * @return {Promise<void>}
   */
  public async createVendor(
    tenantId: number,
    vendorDTO: IVendorNewDTO,
    authorizedUser: ISystemUser
  ) {
    const { Contact } = this.tenancy.models(tenantId);

    // Transforms create DTO to customer object.
    const vendorObject = await this.transformDTO.transformCreateDTO(
      tenantId,
      vendorDTO
    );
    // Creates vendor contact under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onVendorCreating` event.
      await this.eventPublisher.emitAsync(events.vendors.onCreating, {
        tenantId,
        vendorDTO,
        trx,
      } as IVendorEventCreatingPayload);

      // Creates a new contact as vendor.
      const vendor = await Contact.query(trx).insertAndFetch({
        ...vendorObject,
      });
      // Triggers `onVendorCreated` event.
      await this.eventPublisher.emitAsync(events.vendors.onCreated, {
        tenantId,
        vendorId: vendor.id,
        vendor,
        authorizedUser,
        trx,
      } as IVendorEventCreatedPayload);

      return vendor;
    });
  }
}
