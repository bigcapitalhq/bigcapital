import { TenantMetadata } from '@/system/models';
import { Inject, Service } from 'typedi';
import InventoryService from '../Inventory/Inventory';
import { IFinancialSheetCommonMeta } from '@/interfaces';

@Service()
export class FinancialSheetMeta {
  @Inject()
  private inventoryService: InventoryService;

  /**
   * Retrieves the common meta data of the financial sheet.
   * @param {number} tenantId
   * @returns {Promise<IFinancialSheetCommonMeta>}
   */
  async meta(tenantId: number): Promise<IFinancialSheetCommonMeta> {
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    const organizationName = tenantMetadata.name;
    const baseCurrency = tenantMetadata.baseCurrency;
    const dateFormat = tenantMetadata.dateFormat;

    const isCostComputeRunning =
      this.inventoryService.isItemsCostComputeRunning(tenantId);

    return {
      organizationName,
      baseCurrency,
      dateFormat,
      isCostComputeRunning,
      sheetName: '',
    };
  }
}
