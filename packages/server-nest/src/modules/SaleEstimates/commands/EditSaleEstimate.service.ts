import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ISaleEstimateDTO,
  ISaleEstimateEditedPayload,
  ISaleEstimateEditingPayload,
} from '../types/SaleEstimates.types';
import { SaleEstimateValidators } from './SaleEstimateValidators.service';
import { SaleEstimateDTOTransformer } from './SaleEstimateDTOTransformer.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { SaleEstimate } from '../models/SaleEstimate';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { Customer } from '@/modules/Customers/models/Customer';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class EditSaleEstimate {
  constructor(
    private readonly validators: SaleEstimateValidators,
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly transformerDTO: SaleEstimateDTOTransformer,

    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,

    @Inject(Customer.name)
    private readonly customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Edit details of the given estimate with associated entries.
   * @async
   * @param {Integer} estimateId
   * @param {EstimateDTO} estimate
   * @return {Promise<ISaleEstimate>}
   */
  public async editEstimate(
    estimateId: number,
    estimateDTO: ISaleEstimateDTO,
  ): Promise<SaleEstimate> {
    // Retrieve details of the given sale estimate id.
    const oldSaleEstimate = await this.saleEstimateModel()
      .query()
      .findById(estimateId);

    // Validates the given estimate existance.
    this.validators.validateEstimateExistance(oldSaleEstimate);

    // Retrieve the given customer or throw not found service error.
    const customer = await this.customerModel()
      .query()
      .findById(estimateDTO.customerId)
      .throwIfNotFound();

    // Transform DTO object to model object.
    const estimateObj = await this.transformerDTO.transformDTOToModel(
      estimateDTO,
      customer,
      oldSaleEstimate,
    );
    // Validate estimate number uniquiness on the storage.
    if (estimateDTO.estimateNumber) {
      await this.validators.validateEstimateNumberExistance(
        estimateDTO.estimateNumber,
        estimateId,
      );
    }
    // Validate sale estimate entries existance.
    await this.itemsEntriesService.validateEntriesIdsExistance(
      estimateId,
      'SaleEstimate',
      estimateDTO.entries,
    );
    // Validate items IDs existance on the storage.
    await this.itemsEntriesService.validateItemsIdsExistance(
      estimateDTO.entries,
    );
    // Validate non-sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      estimateDTO.entries,
    );
    // Edits estimate transaction with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Trigger `onSaleEstimateEditing` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onEditing, {
        oldSaleEstimate,
        estimateDTO,
        trx,
      } as ISaleEstimateEditingPayload);

      // Upsert the estimate graph to the storage.
      const saleEstimate = await this.saleEstimateModel()
        .query(trx)
        .upsertGraphAndFetch({
          id: estimateId,
          ...estimateObj,
        });

      // Trigger `onSaleEstimateEdited` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onEdited, {
        estimateId,
        saleEstimate,
        oldSaleEstimate,
        estimateDTO,
        trx,
      } as ISaleEstimateEditedPayload);

      return saleEstimate;
    });
  }
}
