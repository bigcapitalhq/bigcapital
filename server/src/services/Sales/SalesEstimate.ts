import { omit, difference, sumBy, mixin } from 'lodash';
import { Service, Inject } from 'typedi';
import { IEstimatesFilter, IFilterMeta, IPaginationMeta, ISaleEstimate, ISaleEstimateDTO } from 'interfaces';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import HasItemsEntries from 'services/Sales/HasItemsEntries';
import { formatDateFields } from 'utils';
import TenancyService from 'services/Tenancy/TenancyService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import events from 'subscribers/events';

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

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;
  

  /**
   * Validate whether the estimate customer exists on the storage. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateEstimateCustomerExistance(req: Request, res: Response, next: Function) {
    const estimate = { ...req.body };
    const { Customer } = req.models

    const foundCustomer = await Customer.query().findById(estimate.customer_id);

    if (!foundCustomer) {
      return res.status(404).send({
        errors: [{ type: 'CUSTOMER.ID.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate the estimate number unique on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateEstimateNumberExistance(req: Request, res: Response, next: Function) {
    const estimate = { ...req.body };
    const { tenantId } = req;

    const isEstNumberUnqiue = await this.saleEstimateService.isEstimateNumberUnique(
      tenantId,
      estimate.estimate_number,
      req.params.id,
    );
    if (isEstNumberUnqiue) {
      return res.boom.badRequest(null, {
        errors: [{ type: 'ESTIMATE.NUMBER.IS.NOT.UNQIUE', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validate the estimate entries items ids existance on the storage. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateEstimateEntriesItemsExistance(req: Request, res: Response, next: Function) {
    const tenantId = req.tenantId;
    const estimate = { ...req.body };
    const estimateItemsIds = estimate.entries.map(e => e.item_id);

    // Validate items ids in estimate entries exists.
    const notFoundItemsIds = await this.itemsService.isItemsIdsExists(tenantId, estimateItemsIds);

    if (notFoundItemsIds.length > 0) {
      return res.boom.badRequest(null, {
        errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 400 }],
      });
    }
    next();
  }

  /**
   * Validate whether the sale estimate id exists on the storage. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateEstimateIdExistance(req: Request, res: Response, next: Function) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    const storedEstimate = await this.saleEstimateService
      .getEstimate(tenantId, estimateId);

    if (!storedEstimate) {
      return res.status(404).send({
        errors: [{ type: 'SALE.ESTIMATE.ID.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate sale invoice entries ids existance on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async valdiateInvoiceEntriesIdsExistance(req: Request, res: Response, next: Function) {
    const { ItemEntry } = req.models;

    const { id: saleInvoiceId } = req.params;
    const saleInvoice = { ...req.body };
    const entriesIds = saleInvoice.entries
      .filter(e => e.id)
      .map((e) => e.id);

    const foundEntries = await ItemEntry.query()
      .whereIn('id', entriesIds)
      .where('reference_type', 'SaleInvoice')
      .where('reference_id', saleInvoiceId);

    if (foundEntries.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ENTRIES.IDS.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * Creates a new estimate with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {EstimateDTO} estimate
   * @return {Promise<ISaleEstimate>}
   */
  async createEstimate(tenantId: number, estimateDTO: ISaleEstimateDTO): Promise<ISaleEstimate> {
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
        entries: estimate.entries.map((entry) => ({ 
          reference_type: 'SaleEstimate',
          reference_id: storedEstimate.id,
          ...omit(entry, ['total', 'amount', 'id']),
        }))
      });

    this.logger.info('[sale_estimate] insert sale estimated success.');
    await this.eventDispatcher.dispatch(events.saleEstimates.onCreated);

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
  async editEstimate(tenantId: number, estimateId: number, estimateDTO: ISaleEstimateDTO): Promise<void> {
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

    await this.itemsEntriesService.patchItemsEntries(
      tenantId,
      estimate.entries,
      storedEstimateEntries,
      'SaleEstimate',
      estimateId,
    );
    await this.eventDispatcher.dispatch(events.saleEstimates.onEdited);
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
    this.logger.info('[sale_estimate] deleted successfully.', { tenantId, estimateId });

    await this.eventDispatcher.dispatch(events.saleEstimates.onDeleted);
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