import { omit, difference, sumBy, mixin } from 'lodash';
import { Service, Inject } from 'typedi';
import { IEstimatesFilter, IFilterMeta, IPaginationMeta } from 'interfaces';
import HasItemsEntries from 'services/Sales/HasItemsEntries';
import { formatDateFields } from 'utils';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';

/**
 * Sale estimate service.
 * @Service
 */
@Service()
export default class SaleEstimateService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  itemsEntriesService: HasItemsEntries;

  @Inject('logger')
  logger: any;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Creates a new estimate with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {EstimateDTO} estimate
   * @return {void}
   */
  async createEstimate(tenantId: number, estimateDTO: any) {
    const { SaleEstimate, ItemEntry } = this.tenancy.models(tenantId);

    const amount = sumBy(estimateDTO.entries, e => ItemEntry.calcAmount(e));
    const estimate = {
      amount,
      ...formatDateFields(estimateDTO, ['estimate_date', 'expiration_date']),
    };

    this.logger.info('[sale_estimate] inserting sale estimate to the storage.');
    const storedEstimate = await SaleEstimate.query()
      .insert({
        ...omit(estimate, ['entries']),
      });
    const storeEstimateEntriesOpers: any[] = [];

    this.logger.info('[sale_estimate] inserting sale estimate entries to the storage.');
    estimate.entries.forEach((entry: any) => {
      const oper = ItemEntry.query()
        .insert({
          reference_type: 'SaleEstimate',
          reference_id: storedEstimate.id,
          ...omit(entry, ['total', 'amount', 'id']),
        });
      storeEstimateEntriesOpers.push(oper);
    });
    await Promise.all([...storeEstimateEntriesOpers]);

    this.logger.info('[sale_estimate] insert sale estimated success.');

    return storedEstimate;
  }

  /**
   * Edit details of the given estimate with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Integer} estimateId
   * @param {EstimateDTO} estimate
   * @return {void}
   */
  async editEstimate(tenantId: number, estimateId: number, estimateDTO: any) {
    const { SaleEstimate, ItemEntry } = this.tenancy.models(tenantId);
    const amount = sumBy(estimateDTO.entries, e => ItemEntry.calcAmount(e));

    const estimate = {
      amount,
      ...formatDateFields(estimateDTO, ['estimate_date', 'expiration_date']),
    };
    this.logger.info('[sale_estimate] editing sale estimate on the storage.');
    const updatedEstimate = await SaleEstimate.query()
      .update({
        ...omit(estimate, ['entries']),
      });
    const storedEstimateEntries = await ItemEntry.query()
      .where('reference_id', estimateId)
      .where('reference_type', 'SaleEstimate');

    const patchItemsEntries = this.itemsEntriesService.patchItemsEntries(
      tenantId,
      estimate.entries,
      storedEstimateEntries,
      'SaleEstimate',
      estimateId,
    );
    return Promise.all([
      patchItemsEntries,
    ]);
  }

  /**
   * Deletes the given estimate id with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {IEstimate} estimateId
   * @return {void}
   */
  async deleteEstimate(tenantId: number, estimateId: number) {
    const { SaleEstimate, ItemEntry } = this.tenancy.models(tenantId);

    this.logger.info('[sale_estimate] delete sale estimate and associated entries from the storage.');
    await ItemEntry.query()
      .where('reference_id', estimateId)
      .where('reference_type', 'SaleEstimate')
      .delete();

    await SaleEstimate.query().where('id', estimateId).delete();
  }

  /**
   * Validates the given estimate ID exists.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Numeric} estimateId
   * @return {Boolean}
   */
  async isEstimateExists(tenantId: number, estimateId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);
    const foundEstimate = await SaleEstimate.query().where('id', estimateId);

    return foundEstimate.length !== 0;
  }

  /**
   * Validates the given estimate entries IDs.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Numeric} estimateId - the sale estimate id.
   * @param {IEstimate} estimate
   */
  async isEstimateEntriesIDsExists(tenantId: number, estimateId: number, estimate: any) {
    const { ItemEntry } = this.tenancy.models(tenantId);
    const estimateEntriesIds = estimate.entries
      .filter((e: any) => e.id)
      .map((e: any) => e.id);

    const estimateEntries = await ItemEntry.query()
      .whereIn('id', estimateEntriesIds)
      .where('reference_id', estimateId)
      .where('reference_type', 'SaleEstimate');

    const storedEstimateEntriesIds = estimateEntries.map((e: any) => e.id);
    const notFoundEntriesIDs = difference(
      estimateEntriesIds,
      storedEstimateEntriesIds
    );
    return notFoundEntriesIDs;
  }

  /**
   * Retrieve the estimate details of the given estimate id.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Integer} estimateId
   * @return {IEstimate}
   */
  async getEstimate(tenantId: number, estimateId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);
    const estimate = await SaleEstimate.query()
      .where('id', estimateId)
      .first();

    return estimate;
  }

  /**
   * Retrieve the estimate details with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Integer} estimateId
   */
  async getEstimateWithEntries(tenantId: number, estimateId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);
    const estimate = await SaleEstimate.query()
      .where('id', estimateId)
      .withGraphFetched('entries')
      .withGraphFetched('customer')
      .first();

    return estimate;
  }

  /**
   * Detarmines the estimate number uniqness.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {String} estimateNumber
   * @param {Integer} excludeEstimateId
   * @return {Boolean}
   */
  async isEstimateNumberUnique(tenantId: number, estimateNumber: string, excludeEstimateId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);
    const foundEstimates = await SaleEstimate.query()
      .onBuild((query: any) => {
        query.where('estimate_number', estimateNumber);
        if (excludeEstimateId) {
          query.whereNot('id', excludeEstimateId);
        }
        return query;
      });
    return foundEstimates.length > 0;
  }

  /**
   * Retrieves estimates filterable and paginated list.
   * @param {number} tenantId 
   * @param {IEstimatesFilter} estimatesFilter 
   */
  public async estimatesList(
    tenantId: number,
    estimatesFilter: IEstimatesFilter
  ): Promise<{ salesEstimates: ISaleEstimate[], pagination: IPaginationMeta, filterMeta: IFilterMeta }> {
    const { SaleEstimate } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(tenantId, SaleEstimate, estimatesFilter);

    const { results, pagination } = await SaleEstimate.query().onBuild(builder => {
      builder.withGraphFetched('customer');
      builder.withGraphFetched('entries');
      dynamicFilter.buildQuery()(builder);
    }).pagination(
      estimatesFilter.page - 1,
      estimatesFilter.pageSize,
    );

    return {
      salesEstimates: results,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }
}