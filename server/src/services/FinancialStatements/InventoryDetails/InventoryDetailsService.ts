import moment from 'moment';
import { Service, Inject } from 'typedi';
import { raw } from 'objection';
import { IInventoryDetailsQuery, IInventoryTransaction } from 'interfaces';
import TenancyService from 'services/Tenancy/TenancyService';
import InventoryDetails from './InventoryDetails';
import FinancialSheet from '../FinancialSheet';
import InventoryDetailsRepository from './InventoryDetailsRepository';

@Service()
export default class InventoryDetailsService extends FinancialSheet {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  reportRepo: InventoryDetailsRepository;

  /**
   * Defaults balance sheet filter query.
   * @return {IBalanceSheetQuery}
   */
  get defaultQuery(): IInventoryDetailsQuery {
    return {
      fromDate: moment().startOf('year').format('YYYY-MM-DD'),
      toDate: moment().endOf('year').format('YYYY-MM-DD'),
      numberFormat: {
        precision: 2,
        divideOn1000: false,
        showZero: false,
        formatMoney: 'total',
        negativeFormat: 'mines',
      },
      noneTransactions: false,
    };
  }

  /**
   * Retrieve the inventory details report data.
   * @param {number} tenantId -
   * @param {IInventoryDetailsQuery} query -
   */
  public async inventoryDetails(
    tenantId: number,
    query: IInventoryDetailsQuery
  ): Promise<any> {
    // Settings tenant service.
    const settings = this.tenancy.settings(tenantId);
    const baseCurrency = settings.get({
      group: 'organization',
      key: 'base_currency',
    });

    const filter = {
      ...this.defaultQuery,
      ...query,
    };
    // Retrieves the items.
    const items = await this.reportRepo.getInventoryItems(tenantId);

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
      baseCurrency
    );

    return {
      data: inventoryDetailsInstance.reportData(),
    };
  }
}
