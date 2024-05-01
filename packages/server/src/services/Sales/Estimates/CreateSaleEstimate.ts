import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import {
  ISaleEstimate,
  ISaleEstimateCreatedPayload,
  ISaleEstimateCreatingPayload,
  ISaleEstimateDTO,
} from '@/interfaces';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SaleEstimateDTOTransformer } from './SaleEstimateDTOTransformer';
import events from '@/subscribers/events';
import { SaleEstimateValidators } from './SaleEstimateValidators';

@Service()
export class CreateSaleEstimate {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private transformerDTO: SaleEstimateDTOTransformer;

  @Inject()
  private validators: SaleEstimateValidators;

  /**
   * Creates a new estimate with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {EstimateDTO} estimate
   * @return {Promise<ISaleEstimate>}
   */
  public async createEstimate(
    tenantId: number,
    estimateDTO: ISaleEstimateDTO,
    trx?: Knex.Transaction
  ): Promise<ISaleEstimate> {
    const { SaleEstimate, Contact } = this.tenancy.models(tenantId);

    // Retrieve the given customer or throw not found service error.
    const customer = await Contact.query()
      .modify('customer')
      .findById(estimateDTO.customerId)
      .throwIfNotFound();

    // Transform DTO object ot model object.
    const estimateObj = await this.transformerDTO.transformDTOToModel(
      tenantId,
      estimateDTO,
      customer
    );
    // Validate estimate number uniquiness on the storage.
    await this.validators.validateEstimateNumberExistance(
      tenantId,
      estimateObj.estimateNumber
    );
    // Validate items IDs existance on the storage.
    await this.itemsEntriesService.validateItemsIdsExistance(
      tenantId,
      estimateDTO.entries
    );
    // Validate non-sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      tenantId,
      estimateDTO.entries
    );
    // Creates a sale estimate transaction with associated transactions as UOW.
    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Triggers `onSaleEstimateCreating` event.
        await this.eventPublisher.emitAsync(events.saleEstimate.onCreating, {
          estimateDTO,
          tenantId,
          trx,
        } as ISaleEstimateCreatingPayload);

        // Upsert the sale estimate graph to the storage.
        const saleEstimate = await SaleEstimate.query(trx).upsertGraphAndFetch({
          ...estimateObj,
        });
        // Triggers `onSaleEstimateCreated` event.
        await this.eventPublisher.emitAsync(events.saleEstimate.onCreated, {
          tenantId,
          saleEstimate,
          saleEstimateId: saleEstimate.id,
          saleEstimateDTO: estimateDTO,
          trx,
        } as ISaleEstimateCreatedPayload);

        return saleEstimate;
      },
      trx
    );
  }
}
