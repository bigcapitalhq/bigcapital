import {
  IBill,
  IBillEditDTO,
  IBillEditedPayload,
  IBillEditingPayload,
  ISystemUser,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { BillsValidators } from './BillsValidators';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import UnitOfWork from '@/services/UnitOfWork';
import { Knex } from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import EntriesService from '@/services/Entries';
import { BillDTOTransformer } from './BillDTOTransformer';

@Service()
export class EditBill {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private validators: BillsValidators;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private entriesService: EntriesService;

  @Inject()
  private transformerDTO: BillDTOTransformer;

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
   * @param {number} tenantId - The given tenant id.
   * @param {Integer} billId - The given bill id.
   * @param {IBillEditDTO} billDTO - The given new bill details.
   * @return {Promise<IBill>}
   */
  public async editBill(
    tenantId: number,
    billId: number,
    billDTO: IBillEditDTO,
    authorizedUser: ISystemUser
  ): Promise<IBill> {
    const { Bill, Contact } = this.tenancy.models(tenantId);

    // Retrieve the given bill or throw not found error.
    const oldBill = await Bill.query()
      .findById(billId)
      .withGraphFetched('entries');

    // Validate bill existance.
    this.validators.validateBillExistance(oldBill);

    // Retrieve vendor details or throw not found service error.
    const vendor = await Contact.query()
      .findById(billDTO.vendorId)
      .modify('vendor')
      .throwIfNotFound();

    // Validate bill number uniqiness on the storage.
    if (billDTO.billNumber) {
      await this.validators.validateBillNumberExists(
        tenantId,
        billDTO.billNumber,
        billId
      );
    }
    // Validate the entries ids existance.
    await this.itemsEntriesService.validateEntriesIdsExistance(
      tenantId,
      billId,
      'Bill',
      billDTO.entries
    );
    // Validate the items ids existance on the storage.
    await this.itemsEntriesService.validateItemsIdsExistance(
      tenantId,
      billDTO.entries
    );
    // Accept the purchasable items only.
    await this.itemsEntriesService.validateNonPurchasableEntriesItems(
      tenantId,
      billDTO.entries
    );
    
    // Transforms the bill DTO to model object.
    const billObj = await this.transformerDTO.billDTOToModel(
      tenantId,
      billDTO,
      vendor,
      authorizedUser,
      oldBill
    );
    // Validate bill total amount should be bigger than paid amount.
    this.validators.validateBillAmountBiggerPaidAmount(
      billObj.amount,
      oldBill.paymentAmount
    );
    // Validate landed cost entries that have allocated cost could not be deleted.
    await this.entriesService.validateLandedCostEntriesNotDeleted(
      oldBill.entries,
      billObj.entries
    );
    // Validate new landed cost entries should be bigger than new entries.
    await this.entriesService.validateLocatedCostEntriesSmallerThanNewEntries(
      oldBill.entries,
      billObj.entries
    );
    // Edits bill transactions and associated transactions under UOW envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBillEditing` event.
      await this.eventPublisher.emitAsync(events.bill.onEditing, {
        trx,
        tenantId,
        oldBill,
        billDTO,
      } as IBillEditingPayload);

      // Update the bill transaction.
      const bill = await Bill.query(trx).upsertGraphAndFetch({
        id: billId,
        ...billObj,
      });
      // Triggers event `onBillEdited`.
      await this.eventPublisher.emitAsync(events.bill.onEdited, {
        tenantId,
        billId,
        oldBill,
        bill,
        billDTO,
        trx,
      } as IBillEditedPayload);

      return bill;
    });
  }
}
