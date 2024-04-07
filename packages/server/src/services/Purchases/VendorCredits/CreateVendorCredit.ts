import { IVendorCreditCreateDTO, IVendorCreditCreatedPayload, IVendorCreditCreatingPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import BaseVendorCredit from './BaseVendorCredit';

@Service()
export default class CreateVendorCredit extends BaseVendorCredit {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Creates a new vendor credit.
   * @param {number} tenantId -
   * @param {IVendorCreditCreateDTO} vendorCreditCreateDTO -
   */
  public newVendorCredit = async (tenantId: number, vendorCreditCreateDTO: IVendorCreditCreateDTO) => {
    const { VendorCredit, Vendor } = this.tenancy.models(tenantId);

    // Triggers `onVendorCreditCreate` event.
    await this.eventPublisher.emitAsync(events.vendorCredit.onCreate, {
      tenantId,
      vendorCreditCreateDTO,
    });
    // Retrieve the given vendor or throw not found service error.
    const vendor = await Vendor.query().findById(vendorCreditCreateDTO.vendorId).throwIfNotFound();

    // Validate items should be sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(tenantId, vendorCreditCreateDTO.entries);
    // Transformes the credit DTO to storage layer.
    const vendorCreditModel = this.transformCreateEditDTOToModel(tenantId, vendorCreditCreateDTO, vendor.currencyCode);
    // Saves the vendor credit transactions under UOW envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onVendorCreditCreating` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onCreating, {
        tenantId,
        vendorCreditCreateDTO,
        trx,
      } as IVendorCreditCreatingPayload);

      // Saves the vendor credit graph.
      const vendorCredit = await VendorCredit.query(trx).upsertGraphAndFetch({
        ...vendorCreditModel,
      });
      // Triggers `onVendorCreditCreated` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onCreated, {
        tenantId,
        vendorCredit,
        vendorCreditCreateDTO,
        trx,
      } as IVendorCreditCreatedPayload);

      return vendorCredit;
    });
  };
}
