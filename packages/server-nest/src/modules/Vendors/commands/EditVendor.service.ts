import {
  IVendorEditDTO,
  IVendorEventEditedPayload,
  IVendorEventEditingPayload,
} from '../types/Vendors.types';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { CreateEditVendorDTOService } from './CreateEditVendorDTO';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Vendor } from '../models/Vendor';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class EditVendorService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly transformDTO: CreateEditVendorDTOService,

    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Edits details of the given vendor.
   * @param   {number} vendorId -
   * @param   {IVendorEditDTO} vendorDTO -
   * @returns {Promise<IVendor>}
   */
  public async editVendor(vendorId: number, vendorDTO: IVendorEditDTO) {
    // Retrieve the vendor or throw not found error.
    const oldVendor = await this.vendorModel()
      .query()
      .findById(vendorId)
      .throwIfNotFound();

    // Transforms vendor DTO to object.
    const vendorObj = this.transformDTO.transformEditDTO(vendorDTO);

    // Edits vendor contact under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onVendorEditing` event.
      await this.eventPublisher.emitAsync(events.vendors.onEditing, {
        trx,
        vendorDTO,
      } as IVendorEventEditingPayload);

      // Edits the vendor contact.
      const vendor = await this.vendorModel()
        .query()
        .updateAndFetchById(vendorId, {
          ...vendorObj,
        });

      // Triggers `onVendorEdited` event.
      await this.eventPublisher.emitAsync(events.vendors.onEdited, {
        vendorId,
        vendor,
        trx,
      } as IVendorEventEditedPayload);

      return vendor;
    });
  }
}
