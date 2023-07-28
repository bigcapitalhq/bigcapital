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

}
