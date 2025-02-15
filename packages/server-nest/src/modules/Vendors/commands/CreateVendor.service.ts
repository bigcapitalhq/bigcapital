import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Vendor } from '../models/Vendor';
import { events } from '@/common/events/events';
import {
  IVendorEventCreatedPayload,
  IVendorEventCreatingPayload,
  IVendorNewDTO,
} from '../types/Vendors.types';
import { CreateEditVendorDTOService } from './CreateEditVendorDTO';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CreateVendorService {
  /**
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {CreateEditVendorDTOService} transformDTO - Create edit vendor DTO service.
   * @param {typeof Vendor} vendorModel - Vendor model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly transformDTO: CreateEditVendorDTOService,

    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Creates a new vendor.
   * @param  {IVendorNewDTO} vendorDTO
   * @return {Promise<void>}
   */
  public async createVendor(vendorDTO: IVendorNewDTO, trx?: Knex.Transaction) {
    // Transforms create DTO to customer object.
    const vendorObject = await this.transformDTO.transformCreateDTO(vendorDTO);

    // Creates vendor contact under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onVendorCreating` event.
      await this.eventPublisher.emitAsync(events.vendors.onCreating, {
        vendorDTO,
        trx,
      } as IVendorEventCreatingPayload);

      // Creates a new contact as vendor.
      const vendor = await this.vendorModel()
        .query(trx)
        .insertAndFetch({
          ...vendorObject,
        });
      // Triggers `onVendorCreated` event.
      await this.eventPublisher.emitAsync(events.vendors.onCreated, {
        vendorId: vendor.id,
        vendor,
        trx,
      } as IVendorEventCreatedPayload);

      return vendor;
    }, trx);
  }
}
