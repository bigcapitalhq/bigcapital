import { Inject, Service } from "typedi";
import { InventoryValuationSheetTableInjectable } from "./InventoryValuationSheetTableInjectable";
import { TableSheetPdf } from "../TableSheetPdf";
import { IInventoryValuationReportQuery } from "@/interfaces";
import { HtmlTableCustomCss } from "./_constants";


@Service()
export class InventoryValuationSheetPdf {
  @Inject()
  private inventoryValuationTable: InventoryValuationSheetTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given balance sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<Buffer> {
    const table = await this.inventoryValuationTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  } 
}