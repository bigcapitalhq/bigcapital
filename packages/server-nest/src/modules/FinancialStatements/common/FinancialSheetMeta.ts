import { Injectable } from '@nestjs/common';
import { IFinancialSheetCommonMeta } from '../types/Report.types';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class FinancialSheetMeta {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieves the common meta data of the financial sheet.
   * @returns {Promise<IFinancialSheetCommonMeta>}
   */
  async meta(): Promise<IFinancialSheetCommonMeta> {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

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
