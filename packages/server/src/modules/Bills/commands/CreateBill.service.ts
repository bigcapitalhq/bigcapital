import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  IBillDTO,
  IBillCreatedPayload,
  IBillCreatingPayload,
} from '../Bills.types';
import { BillDTOTransformer } from './BillDTOTransformer.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BillsValidators } from './BillsValidators.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { Bill } from '../models/Bill';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { CreateBillDto } from '../dtos/Bill.dto';

@Injectable()
export class CreateBill {
  constructor(
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
    private validators: BillsValidators,
    private itemsEntriesService: ItemsEntriesService,
    private transformerDTO: BillDTOTransformer,

    @Inject(Bill.name)
    private billModel: TenantModelProxy<typeof Bill>,

    @Inject(Vendor.name)
    private vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Creates a new bill and stored it to the storage.
   * ----
   * Precedures.
   * ----
   * - Insert bill transactions to the storage.
   * - Insert bill entries to the storage.
   * - Increment the given vendor id.
   * - Record bill journal transactions on the given accounts.
   * - Record bill items inventory transactions.
   * ----
   * @param  {IBillDTO} billDTO -
   * @return {Promise<IBill>}
   */
  public async createBill(
    billDTO: CreateBillDto,
    trx?: Knex.Transaction,
  ): Promise<Bill> {
    // Retrieves the given bill vendor or throw not found error.
    const vendor = await this.vendorModel()
      .query()
      .findById(billDTO.vendorId)
      .throwIfNotFound();

    // Validate the bill number uniqiness on the storage.
    await this.validators.validateBillNumberExists(billDTO.billNumber);

    // Validate items IDs existance.
    await this.itemsEntriesService.validateItemsIdsExistance(billDTO.entries);

    // Validate non-purchasable items.
    await this.itemsEntriesService.validateNonPurchasableEntriesItems(
      billDTO.entries,
    );
    // Validates the cost entries should be with inventory items.
    await this.validators.validateCostEntriesShouldBeInventoryItems(
      billDTO.entries,
    );
    // Transform the bill DTO to model object.
    const billObj = await this.transformerDTO.billDTOToModel(billDTO, vendor);

    // Write new bill transaction with associated transactions under UOW env.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBillCreating` event.
      await this.eventPublisher.emitAsync(events.bill.onCreating, {
        trx,
        billDTO,
      } as IBillCreatingPayload);

      // Inserts the bill graph object to the storage.
      const bill = await this.billModel()
        .query(trx)
        .upsertGraphAndFetch(billObj);

      // Triggers `onBillCreated` event.
      await this.eventPublisher.emitAsync(events.bill.onCreated, {
        bill,
        billDTO,
        trx,
      } as IBillCreatedPayload);

      return bill;
    }, trx);
  }
}
