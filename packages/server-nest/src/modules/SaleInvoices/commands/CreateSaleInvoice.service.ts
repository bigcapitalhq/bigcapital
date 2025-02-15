import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import {
  ISaleInvoiceCreateDTO,
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceCreatingPaylaod,
} from '../SaleInvoice.types';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators.service';
import { CommandSaleInvoiceDTOTransformer } from './CommandSaleInvoiceDTOTransformer.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { SaleEstimateValidators } from '@/modules/SaleEstimates/commands/SaleEstimateValidators.service';
import { SaleInvoice } from '../models/SaleInvoice';
import { SaleEstimate } from '@/modules/SaleEstimates/models/SaleEstimate';
import { Customer } from '@/modules/Customers/models/Customer';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CreateSaleInvoice {
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly validators: CommandSaleInvoiceValidators,
    private readonly transformerDTO: CommandSaleInvoiceDTOTransformer,
    private readonly eventPublisher: EventEmitter2,
    private readonly commandEstimateValidators: SaleEstimateValidators,
    private readonly uow: UnitOfWork,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,

    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Creates a new sale invoices and store it to the storage
   * with associated to entries and journal transactions.
   * @async
   * @param {number} tenantId - Tenant id.
   * @param {ISaleInvoice} saleInvoiceDTO - Sale invoice object DTO.
   * @return {Promise<ISaleInvoice>}
   */
  public createSaleInvoice = async (
    saleInvoiceDTO: ISaleInvoiceCreateDTO,
    // authorizedUser: ITenantUser,
    trx?: Knex.Transaction,
  ): Promise<SaleInvoice> => {
    // Validate customer existance.
    const customer = await this.customerModel()
      .query()
      .findById(saleInvoiceDTO.customerId)
      .throwIfNotFound();

    // Validate the from estimate id exists on the storage.
    if (saleInvoiceDTO.fromEstimateId) {
      const fromEstimate = await this.saleEstimateModel()
        .query()
        .findById(saleInvoiceDTO.fromEstimateId)
        .throwIfNotFound();

      // Validate the sale estimate is not already converted to invoice.
      this.commandEstimateValidators.validateEstimateNotConverted(fromEstimate);
    }
    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(
      saleInvoiceDTO.entries,
    );
    // Validate items should be sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      saleInvoiceDTO.entries,
    );
    // Transform DTO object to model object.
    const saleInvoiceObj = await this.transformCreateDTOToModel(
      customer,
      saleInvoiceDTO,
      // authorizedUser,
    );
    // Validate sale invoice number uniquiness.
    if (saleInvoiceObj.invoiceNo) {
      await this.validators.validateInvoiceNumberUnique(
        saleInvoiceObj.invoiceNo,
      );
    }
    // Creates a new sale invoice and associated transactions under unit of work env.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleInvoiceCreating` event.
      await this.eventPublisher.emitAsync(events.saleInvoice.onCreating, {
        saleInvoiceDTO,
        trx,
      } as ISaleInvoiceCreatingPaylaod);

      // Create sale invoice graph to the storage.
      const saleInvoice = await this.saleInvoiceModel()
        .query(trx)
        .upsertGraph(saleInvoiceObj);

      const eventPayload: ISaleInvoiceCreatedPayload = {
        saleInvoice,
        saleInvoiceDTO,
        saleInvoiceId: saleInvoice.id,
        trx,
      };
      // Triggers the event `onSaleInvoiceCreated`.
      await this.eventPublisher.emitAsync(
        events.saleInvoice.onCreated,
        eventPayload,
      );
      return saleInvoice;
    }, trx);
  };

  /**
   * Transformes create DTO to model.
   * @param {ICustomer} customer -
   * @param {ISaleInvoiceCreateDTO} saleInvoiceDTO -
   */
  private transformCreateDTOToModel = async (
    customer: Customer,
    saleInvoiceDTO: ISaleInvoiceCreateDTO,
  ) => {
    return this.transformerDTO.transformDTOToModel(customer, saleInvoiceDTO);
  };
}
