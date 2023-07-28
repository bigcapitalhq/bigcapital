import { ISaleEstimate, ISaleEstimateDTO } from "@/interfaces";
import { Service } from "typedi";

@Service()
export class CreateSaleEstimate {
  /**
   * Creates a new estimate with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {EstimateDTO} estimate
   * @return {Promise<ISaleEstimate>}
   */
  public async createEstimate(
    tenantId: number,
    estimateDTO: ISaleEstimateDTO
  ): Promise<ISaleEstimate> {
    const { SaleEstimate, Contact } = this.tenancy.models(tenantId);

    // Retrieve the given customer or throw not found service error.
    const customer = await Contact.query()
      .modify('customer')
      .findById(estimateDTO.customerId)
      .throwIfNotFound();

    // Transform DTO object ot model object.
    const estimateObj = await this.transformDTOToModel(
      tenantId,
      estimateDTO,
      customer
    );
    // Validate estimate number uniquiness on the storage.
    await this.validateEstimateNumberExistance(
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
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
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
    });
  }
}
