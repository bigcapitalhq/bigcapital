import moment from 'moment';
import { Service, Inject } from 'typedi';
import {
  IInventoryDetailsQuery,
  IInventoryItemDetailDOO,
  IInventoryItemDetailMeta,
} from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import InventoryDetails from './InventoryDetails';
import FinancialSheet from '../FinancialSheet';
import InventoryDetailsRepository from './InventoryDetailsRepository';
import InventoryService from '@/services/Inventory/Inventory';
import { parseBoolean } from 'utils';
import { Tenant } from '@/system/models';

@Service()
export default class InventoryDetailsService extends FinancialSheet {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  reportRepo: InventoryDetailsRepository;

  @Inject()
  inventoryService: InventoryService;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  private get defaultQuery(): IInventoryDetailsQuery {
    return {
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
      itemsIds: [],
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
      noneTransactions: false,
      branchesIds: [],
      warehousesIds: [],
    };
  }

  /**
   * Retrieve the balance sheet meta.
   * @param {number} tenantId -
   * @returns {IInventoryItemDetailMeta}
   */
  private reportMetadata(tenantId: number): IInventoryItemDetailMeta {
    const settings = this.tenancy.settings(tenantId);

    const isCostComputeRunning =
      this.inventoryService.isItemsCostComputeRunning(tenantId);

    const organizationName = settings.get({
      group: 'organization',
      key: 'name',
    });
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    return {
      isCostComputeRunning: parseBoolean(isCostComputeRunning, false),
      organizationName,
      baseCurrency,
    };
  }

  /**
   * Retrieve the inventory details report data.
   * @param {number} tenantId -
   * @param {IInventoryDetailsQuery} query -
   * @return {Promise<IInventoryItemDetailDOO>}
   */
  public async inventoryDetails(
    tenantId: number,
    query: IInventoryDetailsQuery
  ): Promise<IInventoryItemDetailDOO> {
    const i18n = this.tenancy.i18n(tenantId);

    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    // Retrieves the items.
    const items = await this.reportRepo.getInventoryItems(
      tenantId,
      filter.itemsIds
    );
    // Opening balance transactions.
    const openingBalanceTransactions =
      await this.reportRepo.openingBalanceTransactions(tenantId, filter);

    // Retrieves the inventory transaction.
    const inventoryTransactions =
      await this.reportRepo.itemInventoryTransactions(tenantId, filter);

    // Inventory details report mapper.
    const inventoryDetailsInstance = new InventoryDetails(
      items,
      openingBalanceTransactions,
      inventoryTransactions,
      filter,
      tenant.metadata.baseCurrency,
      i18n
    );

    return {
      data: inventoryDetailsInstance.reportData(),
      query: filter,
      meta: this.reportMetadata(tenantId),
    };
  }
}
