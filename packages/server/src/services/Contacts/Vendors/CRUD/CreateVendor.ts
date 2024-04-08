import { IVendorEventCreatedPayload, IVendorEventCreatingPayload, IVendorNewDTO } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
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
  public async createVendor(tenantId: number, vendorDTO: IVendorNewDTO, trx?: Knex.Transaction) {
    const { Contact } = this.tenancy.models(tenantId);

    // Transformes create DTO to customer object.
    const vendorObject = await this.transformDTO.transformCreateDTO(tenantId, vendorDTO);
    // Creates vendor contact under unit-of-work evnirement.
    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
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
          trx,
        } as IVendorEventCreatedPayload);

        return vendor;
      },
      trx,
    );
  }
}
