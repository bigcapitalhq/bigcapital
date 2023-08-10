import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  ICustomer,
  ISaleInvoice,
  ISaleInvoiceEditDTO,
  ISaleInvoiceEditedPayload,
  ISaleInvoiceEditingPayload,
  ISystemUser,
  ITenantUser,
} from '@/interfaces';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators';
import { CommandSaleInvoiceDTOTransformer } from './CommandSaleInvoiceDTOTransformer';
import events from '@/subscribers/events';

@Service()
export class EditSaleInvoice {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private validators: CommandSaleInvoiceValidators;

  @Inject()
  private transformerDTO: CommandSaleInvoiceDTOTransformer;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Edit the given sale invoice.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {Number} saleInvoiceId - Sale invoice id.
   * @param {ISaleInvoice} saleInvoice - Sale invoice DTO object.
   * @return {Promise<ISaleInvoice>}
   */
  public async editSaleInvoice(
    tenantId: number,
    saleInvoiceId: number,
    saleInvoiceDTO: ISaleInvoiceEditDTO,
    authorizedUser: ISystemUser
  ): Promise<ISaleInvoice> {
    const { SaleInvoice, Contact } = this.tenancy.models(tenantId);

    // Retrieve the sale invoice or throw not found service error.
    const oldSaleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphJoined('entries');

    // Validates the given invoice existance.
    this.validators.validateInvoiceExistance(oldSaleInvoice);

    // Validate customer existance.
    const customer = await Contact.query()
      .findById(saleInvoiceDTO.customerId)
      .modify('customer')
      .throwIfNotFound();

    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Validate non-sellable entries items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Validate the items entries existance.
    await this.itemsEntriesService.validateEntriesIdsExistance(
      tenantId,
      saleInvoiceId,
      'SaleInvoice',
      saleInvoiceDTO.entries
    );
    // Transform DTO object to model object.
    const saleInvoiceObj = await this.tranformEditDTOToModel(
      tenantId,
      customer,
      saleInvoiceDTO,
      oldSaleInvoice,
      authorizedUser
    );
    // Validate sale invoice number uniquiness.
    if (saleInvoiceObj.invoiceNo) {
      await this.validators.validateInvoiceNumberUnique(
        tenantId,
        saleInvoiceObj.invoiceNo,
        saleInvoiceId
      );
    }
    // Validate the invoice amount is not smaller than the invoice payment amount.
    this.validators.validateInvoiceAmountBiggerPaymentAmount(
      saleInvoiceObj.balance,
      oldSaleInvoice.paymentAmount
    );
    // Edit sale invoice transaction in UOW envirment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceEditing` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onEditing, {
        trx,
        oldSaleInvoice,
        tenantId,
        saleInvoiceDTO,
      } as ISaleInvoiceEditingPayload);

      // Upsert the the invoice graph to the storage.
      const saleInvoice: ISaleInvoice =
        await SaleInvoice.query().upsertGraphAndFetch({
          id: saleInvoiceId,
          ...saleInvoiceObj,
        });
      // Edit event payload.
      const editEventPayload: ISaleInvoiceEditedPayload = {
        tenantId,
        saleInvoiceId,
        saleInvoice,
        saleInvoiceDTO,
        oldSaleInvoice,
        authorizedUser,
        trx,
      };
      // Triggers `onSaleInvoiceEdited` event.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onEdited,
        editEventPayload
      );
      return saleInvoice;
    });
  }

  /**
   * Transformes edit DTO to model.
   * @param {number} tennatId -
   * @param {ICustomer} customer -
   * @param {ISaleInvoiceEditDTO} saleInvoiceDTO -
   * @param {ISaleInvoice} oldSaleInvoice
   */
  private tranformEditDTOToModel = async (
    tenantId: number,
    customer: ICustomer,
    saleInvoiceDTO: ISaleInvoiceEditDTO,
    oldSaleInvoice: ISaleInvoice,
    authorizedUser: ITenantUser
  ) => {
    return this.transformerDTO.transformDTOToModel(
      tenantId,
      customer,
      saleInvoiceDTO,
      authorizedUser,
      oldSaleInvoice
    );
  };
}
