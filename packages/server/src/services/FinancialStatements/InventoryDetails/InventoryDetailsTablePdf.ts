import { Inject, Service } from "typedi";
import { InventoryDetailsTableInjectable } from "./InventoryDetailsTableInjectable";
import { TableSheetPdf } from "../TableSheetPdf";
import { IInventoryDetailsQuery } from "@/interfaces";


@Service()
export class InventoryDetailsTablePdf {
  @Inject()
  private inventoryDetailsTable: InventoryDetailsTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given inventory details sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: IInventoryDetailsQuery
  ): Promise<Buffer> {
    const table = await this.inventoryDetailsTable.table(tenantId, query);
    const sheetName = 'Inventory Items Details';

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      sheetName,
      table.meta.baseCurrency
    );
  }

}