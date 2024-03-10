import moment from 'moment';
import { Service, Inject } from 'typedi';
import { IInventoryDetailsQuery, IInvetoryItemDetailDOO } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import { InventoryDetails } from './InventoryDetails';
import FinancialSheet from '../FinancialSheet';
import InventoryDetailsRepository from './InventoryDetailsRepository';
import { Tenant } from '@/system/models';
import { InventoryDetailsMetaInjectable } from './InventoryDetailsMeta';

@Service()
export class InventoryDetailsService extends FinancialSheet {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private reportRepo: InventoryDetailsRepository;

  @Inject()
  private inventoryDetailsMeta: InventoryDetailsMetaInjectable;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  private get defaultQuery(): IInventoryDetailsQuery {
    return {
      fromDate: moment().startOf('month').format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
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
   * Retrieve the inventory details report data.
   * @param {number} tenantId -
   * @param {IInventoryDetailsQuery} query -
   * @return {Promise<IInvetoryItemDetailDOO>}
   */
  public async inventoryDetails(
    tenantId: number,
    query: IInventoryDetailsQuery
  ): Promise<IInvetoryItemDetailDOO> {
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
    const meta = await this.inventoryDetailsMeta.meta(tenantId, query);

    return {
      data: inventoryDetailsInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
