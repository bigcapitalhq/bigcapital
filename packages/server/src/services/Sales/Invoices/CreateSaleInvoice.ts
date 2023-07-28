import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import {
  ICustomer,
  ISaleInvoice,
  ISaleInvoiceCreateDTO,
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceCreatingPaylaod,
  ITenantUser,
} from '@/interfaces';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import SaleEstimateService from '@/services/Sales/SalesEstimate';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { CommandSaleInvoiceDTOTransformer } from './CommandSaleInvoiceDTOTransformer';

@Service()
export class CreateSaleInvoice {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private saleEstimatesService: SaleEstimateService;

  @Inject()
  private validators: CommandSaleInvoiceValidators;

  @Inject()
  private transformerDTO: CommandSaleInvoiceDTOTransformer;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Transformes create DTO to model.
   * @param {number} tenantId -
   * @param {ICustomer} customer -
   * @param {ISaleInvoiceCreateDTO} saleInvoiceDTO -
   */
  private transformCreateDTOToModel = async (
    tenantId: number,
    customer: ICustomer,
    saleInvoiceDTO: ISaleInvoiceCreateDTO,
    authorizedUser: ITenantUser
  ) => {
  return this.transformerDTO.transformDTOToModel(
      tenantId,
      customer,
      saleInvoiceDTO,
      authorizedUser
    );
  };

  /**
   * Creates a new sale invoices and store it to the storage
   * with associated to entries and journal transactions.
   * @async
   * @param  {number} tenantId - Tenant id.
   * @param  {ISaleInvoice} saleInvoiceDTO - Sale invoice object DTO.
   * @return {Promise<ISaleInvoice>}
   */
  public createSaleInvoice = async (
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceCreateDTO,
    authorizedUser: ITenantUser
  ): Promise<ISaleInvoice> => {
    const { SaleInvoice, Contact } = this.tenancy.models(tenantId);

    // Validate customer existance.
    const customer = await Contact.query()
      .modify('customer')
      .findById(saleInvoiceDTO.customerId)
      .throwIfNotFound();

    // Validate the from estimate id exists on the storage.
    if (saleInvoiceDTO.fromEstimateId) {
      const fromEstimate =
        await this.saleEstimatesService.getSaleEstimateOrThrowError(
          tenantId,
          saleInvoiceDTO.fromEstimateId
        );
      // Validate the sale estimate is not already converted to invoice.
      this.saleEstimatesService.validateEstimateNotConverted(fromEstimate);
    }
    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Validate items should be sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      saleInvoiceDTO.entries
    );
    // Transform DTO object to model object.
    const saleInvoiceObj = await this.transformCreateDTOToModel(
      tenantId,
      customer,
      saleInvoiceDTO,
      authorizedUser
    );
    // Validate sale invoice number uniquiness.
    if (saleInvoiceObj.invoiceNo) {
      await this.validators.validateInvoiceNumberUnique(
        tenantId,
        saleInvoiceObj.invoiceNo
      );
    }
    // Creates a new sale invoice and associated transactions under unit of work env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceCreating` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onCreating, {
        saleInvoiceDTO,
        tenantId,
        trx,
      } as ISaleInvoiceCreatingPaylaod);

      // Create sale invoice graph to the storage.
      const saleInvoice = await SaleInvoice.query(trx).upsertGraph(
        saleInvoiceObj
      );
      const eventPayload: ISaleInvoiceCreatedPayload = {
        tenantId,
        saleInvoice,
        saleInvoiceDTO,
        saleInvoiceId: saleInvoice.id,
        authorizedUser,
        trx,
      };
      // Triggers the event `onSaleInvoiceCreated`.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onCreated,
        eventPayload
      );
      return saleInvoice;
    });
  };
}
