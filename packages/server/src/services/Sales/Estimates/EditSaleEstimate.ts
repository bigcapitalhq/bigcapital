import { Inject, Service } from 'typedi';
import {
  ISaleEstimate,
  ISaleEstimateDTO,
  ISaleEstimateEditedPayload,
  ISaleEstimateEditingPayload,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SaleEstimateValidators } from './SaleEstimateValidators';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { SaleEstimateDTOTransformer } from './SaleEstimateDTOTransformer';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import events from '@/subscribers/events';

@Service()
export class EditSaleEstimate {
  @Inject()
  private validators: SaleEstimateValidators;

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

  /**
   * Edit details of the given estimate with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Integer} estimateId
   * @param {EstimateDTO} estimate
   * @return {Promise<ISaleEstimate>}
   */
  public async editEstimate(
    tenantId: number,
    estimateId: number,
    estimateDTO: ISaleEstimateDTO
  ): Promise<ISaleEstimate> {
    const { SaleEstimate, Contact } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale estimate id.
    const oldSaleEstimate = await SaleEstimate.query().findById(estimateId);

    // Validates the given estimate existance.
    this.validators.validateEstimateExistance(oldSaleEstimate);

    // Retrieve the given customer or throw not found service error.
    const customer = await Contact.query()
      .modify('customer')
      .findById(estimateDTO.customerId)
      .throwIfNotFound();

    // Transform DTO object ot model object.
    const estimateObj = await this.transformerDTO.transformDTOToModel(
      tenantId,
      estimateDTO,
      oldSaleEstimate,
      customer
    );
    // Validate estimate number uniquiness on the storage.
    if (estimateDTO.estimateNumber) {
      await this.validators.validateEstimateNumberExistance(
        tenantId,
        estimateDTO.estimateNumber,
        estimateId
      );
    }
    // Validate sale estimate entries existance.
    await this.itemsEntriesService.validateEntriesIdsExistance(
      tenantId,
      estimateId,
      'SaleEstimate',
      estimateDTO.entries
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
    // Edits estimate transaction with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx) => {
      // Trigger `onSaleEstimateEditing` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onEditing, {
        tenantId,
        oldSaleEstimate,
        estimateDTO,
        trx,
      } as ISaleEstimateEditingPayload);

      // Upsert the estimate graph to the storage.
      const saleEstimate = await SaleEstimate.query(trx).upsertGraphAndFetch({
        id: estimateId,
        ...estimateObj,
      });
      // Trigger `onSaleEstimateEdited` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onEdited, {
        tenantId,
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
