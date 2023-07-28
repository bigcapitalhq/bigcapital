import { Service, Inject } from 'typedi';
import { ISalesReceiptsService } from '@/interfaces';
import JournalPosterService from '@/services/Sales/JournalPosterService';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import InventoryService from '@/services/Inventory/Inventory';
import AutoIncrementOrdersService from './AutoIncrementOrdersService';
import { ERRORS } from './Receipts/constants';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { WarehouseTransactionDTOTransform } from '@/services/Warehouses/Integrations/WarehouseTransactionDTOTransform';
import { BranchTransactionDTOTransform } from '@/services/Branches/Integrations/BranchTransactionDTOTransform';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service('SalesReceipts')
export default class SalesReceiptService implements ISalesReceiptsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  journalService: JournalPosterService;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  @Inject()
  inventoryService: InventoryService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject('logger')
  logger: any;

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
   * Validate whether sale receipt exists on the storage.
   * @param {number} tenantId -
   * @param {number} saleReceiptId -
   */
  async getSaleReceiptOrThrowError(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const foundSaleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('entries');

    if (!foundSaleReceipt) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_NOT_FOUND);
    }
    return foundSaleReceipt;
  }
}
