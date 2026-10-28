import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Vendor } from '../models/Vendor';
import { events } from '@/common/events/events';
import {
  IVendorEventCreatedPayload,
  IVendorEventCreatingPayload,
} from '../types/Vendors.types';
import { CreateEditVendorDTOService } from './CreateEditVendorDTO';
import { VendorIncrement } from './VendorIncrement.service';
import { VendorValidators } from './VendorValidators';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateVendorDto } from '../dtos/CreateVendor.dto';

@Injectable()
export class CreateVendorService {
  /**
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {CreateEditVendorDTOService} transformDTO - Create edit vendor DTO service.
   * @param {VendorIncrement} vendorIncrement - Vendor increment service.
   * @param {VendorValidators} validators - Vendor validators service.
   * @param {typeof Vendor} vendorModel - Vendor model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly transformDTO: CreateEditVendorDTOService,
    private readonly vendorIncrement: VendorIncrement,
    private readonly validators: VendorValidators,

    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Creates a new vendor.
   * @param  {IVendorNewDTO} vendorDTO
   * @return {Promise<void>}
   */
  public async createVendor(
    vendorDTO: CreateVendorDto,
    trx?: Knex.Transaction,
  ) {
    // Transforms create DTO to customer object.
    const vendorObject = await this.transformDTO.transformCreateDTO(vendorDTO);

    // Retrieves the next auto-generated vendor code when no manual code provided.
    const autoCode = vendorObject.code
      ? ''
      : await this.vendorIncrement.getNextVendorCode();

    // Manual codes take precedence over auto-generated ones.
    const code = vendorObject.code || autoCode;
    const isAutoCodeUsed = !vendorObject.code && Boolean(autoCode);

    // Validates the vendor code uniqueness.
    await this.validators.validateVendorCodeUnique(code);

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
          ...(code ? { code } : {}),
        });

      // Increments the next vendor code once the auto-generated code is used.
      if (isAutoCodeUsed) {
        await this.vendorIncrement.incrementNextVendorCode();
      }
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
