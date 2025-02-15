import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  IVendorCreditCreatedPayload,
  IVendorCreditCreateDTO,
  IVendorCreditCreatingPayload,
} from '@/modules/VendorCredit/types/VendorCredit.types';
import { VendorCredit } from '../models/VendorCredit';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { events } from '@/common/events/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { VendorCreditDTOTransformService } from './VendorCreditDTOTransform.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CreateVendorCreditService {
  /**
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {ItemsEntriesService} itemsEntriesService - The items entries service.
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {typeof VendorCredit} vendorCreditModel - The vendor credit model.
   * @param {typeof Vendor} vendorModel - The vendor model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly eventPublisher: EventEmitter2,
    private readonly vendorCreditDTOTransformService: VendorCreditDTOTransformService,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: TenantModelProxy<typeof VendorCredit>,

    @Inject(Vendor.name)
    private readonly vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Creates a new vendor credit.
   * @param {IVendorCreditCreateDTO} vendorCreditCreateDTO -
   * @param {Knex.Transaction} trx -
   */
  public newVendorCredit = async (
    vendorCreditCreateDTO: IVendorCreditCreateDTO,
    trx?: Knex.Transaction,
  ) => {
    // Triggers `onVendorCreditCreate` event.
    await this.eventPublisher.emitAsync(events.vendorCredit.onCreate, {
      vendorCreditCreateDTO,
    });
    // Retrieve the given vendor or throw not found service error.
    const vendor = await this.vendorModel()
      .query()
      .findById(vendorCreditCreateDTO.vendorId)
      .throwIfNotFound();

    // Validate items should be sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      vendorCreditCreateDTO.entries,
    );
    // Transforms the credit DTO to storage layer.
    const vendorCreditModel =
      this.vendorCreditDTOTransformService.transformCreateEditDTOToModel(
        vendorCreditCreateDTO,
        vendor.currencyCode,
      );
    // Saves the vendor credit transactions under UOW environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onVendorCreditCreating` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onCreating, {
        vendorCreditCreateDTO,
        trx,
      } as IVendorCreditCreatingPayload);

      // Saves the vendor credit graph.
      const vendorCredit = await this.vendorCreditModel()
        .query(trx)
        .upsertGraphAndFetch({
          ...vendorCreditModel,
        });

      // Triggers `onVendorCreditCreated` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onCreated, {
        vendorCredit,
        vendorCreditCreateDTO,
        trx,
      } as IVendorCreditCreatedPayload);

      return vendorCredit;
    }, trx);
  };
}
