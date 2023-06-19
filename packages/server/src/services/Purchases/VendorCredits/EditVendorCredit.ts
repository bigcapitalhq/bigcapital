import { Service, Inject } from 'typedi';
import {
  IVendorCreditEditDTO,
  IVendorCreditEditedPayload,
  IVendorCreditEditingPayload,
} from '@/interfaces';
import BaseVendorCredit from './BaseVendorCredit';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import events from '@/subscribers/events';

@Service()
export default class EditVendorCredit extends BaseVendorCredit {
  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  /**
   * Deletes the given vendor credit.
   * @param {number} tenantId - Tenant id.
   * @param {number} vendorCreditId - Vendor credit id.
   */
  public editVendorCredit = async (
    tenantId: number,
    vendorCreditId: number,
    vendorCreditDTO: IVendorCreditEditDTO
  ) => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    // Retrieve the vendor credit or throw not found service error.
    const oldVendorCredit = await this.getVendorCreditOrThrowError(
      tenantId,
      vendorCreditId
    );
    // Validate customer existence.
    const vendor = await Contact.query()
      .modify('vendor')
      .findById(vendorCreditDTO.vendorId)
      .throwIfNotFound();

    // Validate items ids existence.
    await this.itemsEntriesService.validateItemsIdsExistence(
      tenantId,
      vendorCreditDTO.entries
    );
    // Validate non-sellable entries items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      vendorCreditDTO.entries
    );
    // Validate the items entries existence.
    await this.itemsEntriesService.validateEntriesIdsExistence(
      tenantId,
      vendorCreditId,
      'VendorCredit',
      vendorCreditDTO.entries
    );
    // Transformes edit DTO to model storage layer.
    const vendorCreditModel = this.transformCreateEditDTOToModel(
      tenantId,
      vendorCreditDTO,
      vendor.currencyCode,
      oldVendorCredit
    );
    // Edits the vendor credit graph under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx) => {
      // Triggers `onVendorCreditEditing` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onEditing, {
        tenantId,
        oldVendorCredit,
        vendorCreditDTO,
        trx,
      } as IVendorCreditEditingPayload);

      // Saves the vendor credit graph to the storage.
      const vendorCredit = await VendorCredit.query(trx).upsertGraphAndFetch({
        id: vendorCreditId,
        ...vendorCreditModel,
      });
      // Triggers `onVendorCreditEdited event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onEdited, {
        tenantId,
        oldVendorCredit,
        vendorCredit,
        vendorCreditId,
        trx,
      } as IVendorCreditEditedPayload);

      return vendorCredit;
    });
  };
}
