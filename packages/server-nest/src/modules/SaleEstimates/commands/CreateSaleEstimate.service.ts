import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ISaleEstimateCreatedPayload,
  ISaleEstimateCreatingPayload,
  ISaleEstimateDTO,
} from '../types/SaleEstimates.types';
import { SaleEstimateDTOTransformer } from './SaleEstimateDTOTransformer.service';
import { SaleEstimateValidators } from './SaleEstimateValidators.service';
import { SaleEstimate } from '../models/SaleEstimate';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { Customer } from '@/modules/Customers/models/Customer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CreateSaleEstimate {
  constructor(
    @Inject(SaleEstimate.name)
    private saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,

    @Inject(Customer.name)
    private customerModel: TenantModelProxy<typeof Customer>,

    private itemsEntriesService: ItemsEntriesService,
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,
    private transformerDTO: SaleEstimateDTOTransformer,
    private validators: SaleEstimateValidators,
  ) {}

  /**
   * Creates a new estimate with associated entries.
   * @param {ISaleEstimateDTO} estimateDTO - Sale estimate DTO object.
   * @return {Promise<ISaleEstimate>}
   */
  public async createEstimate(
    estimateDTO: ISaleEstimateDTO,
    trx?: Knex.Transaction,
  ): Promise<SaleEstimate> {
    // Retrieve the given customer or throw not found service error.
    const customer = await this.customerModel()
      .query()
      .findById(estimateDTO.customerId)
      .throwIfNotFound();

    // Transform DTO object to model object.
    const estimateObj = await this.transformerDTO.transformDTOToModel(
      estimateDTO,
      customer,
    );
    // Validate estimate number uniquiness on the storage.
    await this.validators.validateEstimateNumberExistance(
      estimateObj.estimateNumber,
    );
    // Validate items IDs existance on the storage.
    await this.itemsEntriesService.validateItemsIdsExistance(
      estimateDTO.entries,
    );
    // Validate non-sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      estimateDTO.entries,
    );
    // Creates a sale estimate transaction with associated transactions as UOW.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onSaleEstimateCreating` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onCreating, {
        estimateDTO,
        trx,
      } as ISaleEstimateCreatingPayload);

      // Upsert the sale estimate graph to the storage.
      const saleEstimate = await this.saleEstimateModel()
        .query(trx)
        .upsertGraphAndFetch({
          ...estimateObj,
        });
      // Triggers `onSaleEstimateCreated` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onCreated, {
        saleEstimate,
        saleEstimateId: saleEstimate.id,
        saleEstimateDTO: estimateDTO,
        trx,
      } as ISaleEstimateCreatedPayload);

      return saleEstimate;
    }, trx);
  }
}
