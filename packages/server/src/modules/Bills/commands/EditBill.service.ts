import {
  IBillEditDTO,
  IBillEditedPayload,
  IBillEditingPayload,
} from '../Bills.types';
import { Inject, Injectable } from '@nestjs/common';
import { BillsValidators } from './BillsValidators.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BillDTOTransformer } from './BillDTOTransformer.service';
import { Bill } from '../models/Bill';
import { events } from '@/common/events/events';
import { Vendor } from '@/modules/Vendors/models/Vendor';
import { Knex } from 'knex';
import { TransactionLandedCostEntriesService } from '@/modules/BillLandedCosts/TransactionLandedCostEntries.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditBillDto } from '../dtos/Bill.dto';

@Injectable()
export class EditBillService {
  constructor(
    private validators: BillsValidators,
    private itemsEntriesService: ItemsEntriesService,
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
    private transactionLandedCostEntries: TransactionLandedCostEntriesService,
    private transformerDTO: BillDTOTransformer,

    @Inject(Bill.name) private billModel: TenantModelProxy<typeof Bill>,
    @Inject(Vendor.name) private vendorModel: TenantModelProxy<typeof Vendor>,
  ) { }

  /**
   * Edits details of the given bill id with associated entries.
   *
   * Precedures:
   * -------
   * - Update the bill transaction on the storage.
   * - Update the bill entries on the storage and insert the not have id and delete
   *   once that not presented.
   * - Increment the diff amount on the given vendor id.
   * - Re-write the inventory transactions.
   * - Re-write the bill journal transactions.
   * ------
   * @param {Integer} billId - The given bill id.
   * @param {IBillEditDTO} billDTO - The given new bill details.
   * @return {Promise<IBill>}
   */
  public async editBill(billId: number, billDTO: EditBillDto): Promise<Bill> {
    // Retrieve the given bill or throw not found error.
    const oldBill = await this.billModel()
      .query()
      .findById(billId)
      .withGraphFetched('entries');

    // Validate bill existance.
    this.validators.validateBillExistance(oldBill);

    // Retrieve vendor details or throw not found service error.
    const vendor = await this.vendorModel()
      .query()
      .findById(billDTO.vendorId)
      .throwIfNotFound();

    // Validate bill number uniqiness on the storage.
    if (billDTO.billNumber) {
      await this.validators.validateBillNumberExists(
        billDTO.billNumber,
        billId,
      );
    }
    // Validate the entries ids existance.
    await this.itemsEntriesService.validateEntriesIdsExistance(
      billId,
      'Bill',
      billDTO.entries,
    );
    // Validate the items ids existance on the storage.
    await this.itemsEntriesService.validateItemsIdsExistance(billDTO.entries);
    // Accept the purchasable items only.
    await this.itemsEntriesService.validateNonPurchasableEntriesItems(
      billDTO.entries,
    );

    // Transforms the bill DTO to model object.
    const billObj = await this.transformerDTO.billDTOToModel(
      billDTO,
      vendor,
      oldBill,
    );
    // Validate bill total amount should be bigger than paid amount.
    this.validators.validateBillAmountBiggerPaidAmount(
      billObj.amount,
      oldBill.paymentAmount,
    );
    // Validate landed cost entries that have allocated cost could not be deleted.
    await this.transactionLandedCostEntries.validateLandedCostEntriesNotDeleted(
      oldBill.entries,
      billObj.entries,
    );
    // Validate new landed cost entries should be bigger than new entries.
    await this.transactionLandedCostEntries.validateLocatedCostEntriesSmallerThanNewEntries(
      oldBill.entries,
      billObj.entries,
    );
    // Edits bill transactions and associated transactions under UOW envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBillEditing` event.
      await this.eventPublisher.emitAsync(events.bill.onEditing, {
        oldBill,
        billDTO,
        trx,
      } as IBillEditingPayload);

      // Update the bill transaction.
      const bill = await this.billModel()
        .query(trx)
        .upsertGraphAndFetch({
          id: billId,
          ...billObj,
        });
      // Triggers event `onBillEdited`.
      await this.eventPublisher.emitAsync(events.bill.onEdited, {
        oldBill,
        bill,
        billDTO,
        trx,
      } as IBillEditedPayload);

      return bill;
    });
  }
}
