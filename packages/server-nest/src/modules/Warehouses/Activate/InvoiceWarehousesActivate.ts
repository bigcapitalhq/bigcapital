import { Injectable } from "@nestjs/common";
import { Warehouse } from "../models/Warehouse.model";
import { SaleInvoice } from "@/modules/SaleInvoices/models/SaleInvoice";
import { ItemEntry } from "@/modules/TransactionItemEntry/models/ItemEntry";
import { TenantModelProxy } from "@/modules/System/models/TenantBaseModel";

@Injectable()
export class InvoicesActivateWarehouses {
  constructor(
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,
  ) {}
 

  /**
   * Updates all inventory transactions with the primary warehouse.
   * @param   {Warehouse} primaryWarehouse
   * @returns {Promise<void>}
   */
  updateInvoicesWithWarehouse = async (
    primaryWarehouse: Warehouse
  ): Promise<void> => {
    // Updates the sale invoices with primary warehouse.
    await this.saleInvoiceModel().query().update({
      warehouseId: primaryWarehouse.id,
    });

    // Update the sale invoices entries with primary warehouse.
    await this.itemEntryModel()
      .query()
      .where('referenceType', 'SaleInvoice')
      .update({
        warehouseId: primaryWarehouse.id,
      });
  };
}
