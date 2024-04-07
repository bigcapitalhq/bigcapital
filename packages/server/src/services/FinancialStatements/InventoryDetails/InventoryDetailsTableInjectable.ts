import { IInventoryDetailsQuery, IInvetoryItemDetailsTable } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { InventoryDetailsService } from './InventoryDetailsService';
import { InventoryDetailsTable } from './InventoryDetailsTable';

@Service()
export class InventoryDetailsTableInjectable {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private inventoryDetails: InventoryDetailsService;

  /**
   * Retrieves the inventory item details in table format.
   * @param {number} tenantId
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<IInvetoryItemDetailsTable>}
   */
  public async table(tenantId: number, query: IInventoryDetailsQuery): Promise<IInvetoryItemDetailsTable> {
    const i18n = this.tenancy.i18n(tenantId);

    const inventoryDetails = await this.inventoryDetails.inventoryDetails(tenantId, query);
    const table = new InventoryDetailsTable(inventoryDetails, i18n);

    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
      query: inventoryDetails.query,
      meta: inventoryDetails.meta,
    };
  }
}
