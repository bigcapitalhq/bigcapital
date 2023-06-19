import { omit, sumBy } from 'lodash';
import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import { Knex } from 'knex';
import {
  IEstimatesFilter,
  IFilterMeta,
  IPaginationMeta,
  ISaleEstimate,
  ISaleEstimateApprovedEvent,
  ISaleEstimateCreatedPayload,
  ISaleEstimateCreatingPayload,
  ISaleEstimateDeletedPayload,
  ISaleEstimateDeletingPayload,
  ISaleEstimateDTO,
  ISaleEstimateEditedPayload,
  ISaleEstimateEditingPayload,
  ISaleEstimateEventDeliveredPayload,
  ISaleEstimateEventDeliveringPayload,
  ISaleEstimateApprovingEvent,
  ISalesEstimatesService,
  ICustomer,
} from '@/interfaces';
import { formatDateFields } from 'utils';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import events from '@/subscribers/events';
import { ServiceError } from '@/exceptions';
import moment from 'moment';
import AutoIncrementOrdersService from './AutoIncrementOrdersService';
import SaleEstimateTransformer from './Estimates/SaleEstimateTransformer';
import { ERRORS } from './Estimates/constants';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

/**
 * Sale estimate service.
 * @Service
 */
@Service('SalesEstimates')
export default class SaleEstimateService implements ISalesEstimatesService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  @Inject('logger')
  logger: any;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  autoIncrementOrdersService: AutoIncrementOrdersService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  branchDTOTransform: BranchTransactionDTOTransform;

  @Inject()
  warehouseDTOTransform: WarehouseTransactionDTOTransform;

  @Inject()
  transformer: TransformerInjectable;

  /**
   * Retrieve sale estimate or throw service error.
   * @param {number} tenantId
   * @return {ISaleEstimate}
   */
  async getSaleEstimateOrThrowError(tenantId: number, saleEstimateId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);
    const foundSaleEstimate = await SaleEstimate.query().findById(
      saleEstimateId
    );

    if (!foundSaleEstimate) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_FOUND);
    }
    return foundSaleEstimate;
  }

  /**
   * Validate the estimate number unique on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateEstimateNumberExistance(
    tenantId: number,
    estimateNumber: string,
    notEstimateId?: number
  ) {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const foundSaleEstimate = await SaleEstimate.query()
      .findOne('estimate_number', estimateNumber)
      .onBuild((builder) => {
        if (notEstimateId) {
          builder.whereNot('id', notEstimateId);
        }
      });
    if (foundSaleEstimate) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NUMBER_EXISTANCE);
    }
  }

  /**
   * Validates the given sale estimate not already converted to invoice.
   * @param {ISaleEstimate} saleEstimate -
   */
  validateEstimateNotConverted(saleEstimate: ISaleEstimate) {
    if (saleEstimate.isConvertedToInvoice) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_CONVERTED_TO_INVOICE);
    }
  }

  /**
   * Retrieve the next unique estimate number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  getNextEstimateNumber(tenantId: number): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'sales_estimates'
    );
  }

  /**
   * Increment the estimate next number.
   * @param {number} tenantId -
   */
  incrementNextEstimateNumber(tenantId: number) {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'sales_estimates'
    );
  }

  /**
   * Retrieve estimate number to object model.
   * @param {number} tenantId
   * @param {ISaleEstimateDTO} saleEstimateDTO
   * @param {ISaleEstimate} oldSaleEstimate
   */
  transformEstimateNumberToModel(
    tenantId: number,
    saleEstimateDTO: ISaleEstimateDTO,
    oldSaleEstimate?: ISaleEstimate
  ): string {
    // Retreive the next invoice number.
    const autoNextNumber = this.getNextEstimateNumber(tenantId);

    if (saleEstimateDTO.estimateNumber) {
      return saleEstimateDTO.estimateNumber;
    }
    return oldSaleEstimate ? oldSaleEstimate.estimateNumber : autoNextNumber;
  }

  /**
   * Transform create DTO object ot model object.
   * @param  {number} tenantId
   * @param  {ISaleEstimateDTO} saleEstimateDTO - Sale estimate DTO.
   * @return {ISaleEstimate}
   */
  async transformDTOToModel(
    tenantId: number,
    estimateDTO: ISaleEstimateDTO,
    paymentCustomer: ICustomer,
    oldSaleEstimate?: ISaleEstimate
  ): Promise<ISaleEstimate> {
    const { ItemEntry, Contact } = this.tenancy.models(tenantId);

    const amount = sumBy(estimateDTO.entries, (e) => ItemEntry.calcAmount(e));

    // Retreive the next invoice number.
    const autoNextNumber = this.getNextEstimateNumber(tenantId);

    // Retreive the next estimate number.
    const estimateNumber =
      estimateDTO.estimateNumber ||
      oldSaleEstimate?.estimateNumber ||
      autoNextNumber;

    // Validate the sale estimate number require.
    this.validateEstimateNoRequire(estimateNumber);

    const initialDTO = {
      amount,
      ...formatDateFields(omit(estimateDTO, ['delivered', 'entries']), [
        'estimateDate',
        'expirationDate',
      ]),
      currencyCode: paymentCustomer.currencyCode,
      exchangeRate: estimateDTO.exchangeRate || 1,
      ...(estimateNumber ? { estimateNumber } : {}),
      entries: estimateDTO.entries.map((entry) => ({
        reference_type: 'SaleEstimate',
        ...entry,
      })),
      // Avoid rewrite the deliver date in edit mode when already published.
      ...(estimateDTO.delivered &&
        !oldSaleEstimate?.deliveredAt && {
          deliveredAt: moment().toMySqlDateTime(),
        }),
    };
    return R.compose(
      this.branchDTOTransform.transformDTO<ISaleEstimate>(tenantId),
      this.warehouseDTOTransform.transformDTO<ISaleEstimate>(tenantId)
    )(initialDTO);
  }

  /**
   * Validate the sale estimate number require.
   * @param {ISaleEstimate} saleInvoiceObj
   */
  validateEstimateNoRequire(estimateNumber: string) {
    if (!estimateNumber) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NO_IS_REQUIRED);
    }
  }

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

  /**
   * Edit details of the given estimate with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Integer} estimateId
   * @param {EstimateDTO} estimate
   * @return {void}
   */
  public async editEstimate(
    tenantId: number,
    estimateId: number,
    estimateDTO: ISaleEstimateDTO
  ): Promise<ISaleEstimate> {
    const { SaleEstimate, Contact } = this.tenancy.models(tenantId);

    const oldSaleEstimate = await this.getSaleEstimateOrThrowError(
      tenantId,
      estimateId
    );
    // Retrieve the given customer or throw not found service error.
    const customer = await Contact.query()
      .modify('customer')
      .findById(estimateDTO.customerId)
      .throwIfNotFound();

    // Transform DTO object ot model object.
    const estimateObj = await this.transformDTOToModel(
      tenantId,
      estimateDTO,
      oldSaleEstimate,
      customer
    );
    // Validate estimate number uniquiness on the storage.
    if (estimateDTO.estimateNumber) {
      await this.validateEstimateNumberExistance(
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
    // under unit-of-work environment.
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
        trx,
      } as ISaleEstimateEditedPayload);

      return saleEstimate;
    });
  }

  /**
   * Deletes the given estimate id with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {IEstimate} estimateId
   * @return {void}
   */
  public async deleteEstimate(
    tenantId: number,
    estimateId: number
  ): Promise<void> {
    const { SaleEstimate, ItemEntry } = this.tenancy.models(tenantId);

    // Retrieve sale estimate or throw not found service error.
    const oldSaleEstimate = await this.getSaleEstimateOrThrowError(
      tenantId,
      estimateId
    );
    // Throw error if the sale estimate converted to sale invoice.
    if (oldSaleEstimate.convertedToInvoiceId) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_CONVERTED_TO_INVOICE);
    }
    // Deletes the estimate with associated transactions under UOW environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleEstimatedDeleting` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDeleting, {
        trx,
        tenantId,
        oldSaleEstimate,
      } as ISaleEstimateDeletingPayload);

      // Delete sale estimate entries.
      await ItemEntry.query(trx)
        .where('reference_id', estimateId)
        .where('reference_type', 'SaleEstimate')
        .delete();

      // Delete sale estimate transaction.
      await SaleEstimate.query(trx).where('id', estimateId).delete();

      // Triggers `onSaleEstimatedDeleted` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDeleted, {
        tenantId,
        saleEstimateId: estimateId,
        oldSaleEstimate,
        trx,
      } as ISaleEstimateDeletedPayload);
    });
  }

  /**
   * Retrieve the estimate details with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Integer} estimateId
   */
  public async getEstimate(tenantId: number, estimateId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);
    const estimate = await SaleEstimate.query()
      .findById(estimateId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('branch');

    if (!estimate) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_FOUND);
    }
    // Transformes sale estimate model to POJO.
    return this.transformer.transform(
      tenantId,
      estimate,
      new SaleEstimateTransformer()
    );
  }

  /**
   * Parses estimates list filter DTO.
   * @param filterDTO
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieves estimates filterable and paginated list.
   * @param {number} tenantId -
   * @param {IEstimatesFilter} estimatesFilter -
   */
  public async estimatesList(
    tenantId: number,
    filterDTO: IEstimatesFilter
  ): Promise<{
    salesEstimates: ISaleEstimate[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      SaleEstimate,
      filter
    );
    const { results, pagination } = await SaleEstimate.query()
      .onBuild((builder) => {
        builder.withGraphFetched('customer');
        builder.withGraphFetched('entries');
        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    const transformedEstimates = await this.transformer.transform(
      tenantId,
      results,
      new SaleEstimateTransformer()
    );
    return {
      salesEstimates: transformedEstimates,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Converts estimate to invoice.
   * @param {number} tenantId -
   * @param {number} estimateId -
   * @return {Promise<void>}
   */
  async convertEstimateToInvoice(
    tenantId: number,
    estimateId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale estimate.
    const saleEstimate = await this.getSaleEstimateOrThrowError(
      tenantId,
      estimateId
    );
    // Marks the estimate as converted from the givne invoice.
    await SaleEstimate.query(trx).where('id', estimateId).patch({
      convertedToInvoiceId: invoiceId,
      convertedToInvoiceAt: moment().toMySqlDateTime(),
    });
    // Triggers `onSaleEstimateConvertedToInvoice` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onConvertedToInvoice,
      {}
    );
  }

  /**
   * Unlink the converted sale estimates from the given sale invoice.
   * @param {number} tenantId -
   * @param {number} invoiceId -
   * @return {Promise<void>}
   */
  async unlinkConvertedEstimateFromInvoice(
    tenantId: number,
    invoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    await SaleEstimate.query(trx)
      .where({
        convertedToInvoiceId: invoiceId,
      })
      .patch({
        convertedToInvoiceId: null,
        convertedToInvoiceAt: null,
      });
  }

  /**
   * Mark the sale estimate as delivered.
   * @param {number} tenantId - Tenant id.
   * @param {number} saleEstimateId - Sale estimate id.
   */
  public async deliverSaleEstimate(
    tenantId: number,
    saleEstimateId: number
  ): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale estimate id.
    const oldSaleEstimate = await this.getSaleEstimateOrThrowError(
      tenantId,
      saleEstimateId
    );
    // Throws error in case the sale estimate already published.
    if (oldSaleEstimate.isDelivered) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_ALREADY_DELIVERED);
    }
    // Updates the sale estimate transaction with associated transactions
    // under UOW environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleEstimateDelivering` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDelivering, {
        oldSaleEstimate,
        trx,
        tenantId,
      } as ISaleEstimateEventDeliveringPayload);

      // Record the delivered at on the storage.
      const saleEstimate = await SaleEstimate.query(trx).patchAndFetchById(
        saleEstimateId,
        {
          deliveredAt: moment().toMySqlDateTime(),
        }
      );
      // Triggers `onSaleEstimateDelivered` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onDelivered, {
        tenantId,
        saleEstimate,
        trx,
      } as ISaleEstimateEventDeliveredPayload);
    });
  }

  /**
   * Mark the sale estimate as approved from the customer.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   */
  public async approveSaleEstimate(
    tenantId: number,
    saleEstimateId: number
  ): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale estimate id.
    const oldSaleEstimate = await this.getSaleEstimateOrThrowError(
      tenantId,
      saleEstimateId
    );
    // Throws error in case the sale estimate still not delivered to customer.
    if (!oldSaleEstimate.isDelivered) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_DELIVERED);
    }
    // Throws error in case the sale estimate already approved.
    if (oldSaleEstimate.isApproved) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_ALREADY_APPROVED);
    }
    // Triggers `onSaleEstimateApproving` event.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onSaleEstimateApproving` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onApproving, {
        trx,
        tenantId,
        oldSaleEstimate,
      } as ISaleEstimateApprovingEvent);

      // Update estimate as approved.
      const saleEstimate = await SaleEstimate.query(trx)
        .where('id', saleEstimateId)
        .patch({
          approvedAt: moment().toMySqlDateTime(),
          rejectedAt: null,
        });
      // Triggers `onSaleEstimateApproved` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onApproved, {
        trx,
        tenantId,
        oldSaleEstimate,
        saleEstimate,
      } as ISaleEstimateApprovedEvent);
    });
  }

  /**
   * Mark the sale estimate as rejected from the customer.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   */
  public async rejectSaleEstimate(
    tenantId: number,
    saleEstimateId: number
  ): Promise<void> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve details of the given sale estimate id.
    const saleEstimate = await this.getSaleEstimateOrThrowError(
      tenantId,
      saleEstimateId
    );
    // Throws error in case the sale estimate still not delivered to customer.
    if (!saleEstimate.isDelivered) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_DELIVERED);
    }
    // Throws error in case the sale estimate already rejected.
    if (saleEstimate.isRejected) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_ALREADY_REJECTED);
    }
    //
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Mark the sale estimate as reject on the storage.
      await SaleEstimate.query(trx).where('id', saleEstimateId).patch({
        rejectedAt: moment().toMySqlDateTime(),
        approvedAt: null,
      });
      // Triggers `onSaleEstimateRejected` event.
      await this.eventPublisher.emitAsync(events.saleEstimate.onRejected, {});
    });
  }

  /**
   * Validate the given customer has no sales estimates.
   * @param {number} tenantId
   * @param {number} customerId - Customer id.
   */
  public async validateCustomerHasNoEstimates(
    tenantId: number,
    customerId: number
  ) {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const estimates = await SaleEstimate.query().where(
      'customer_id',
      customerId
    );
    if (estimates.length > 0) {
      throw new ServiceError(ERRORS.CUSTOMER_HAS_SALES_ESTIMATES);
    }
  }
}
