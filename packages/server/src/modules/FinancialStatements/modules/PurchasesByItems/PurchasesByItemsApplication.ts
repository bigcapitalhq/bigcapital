import { Injectable } from '@nestjs/common';
import { PurchasesByItemsExport } from './PurchasesByItemsExport';
import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsSheet,
  IPurchasesByItemsTable,
} from './types/PurchasesByItems.types';
import { PurchasesByItemsTableInjectable } from './PurchasesByItemsTableInjectable';
import { PurchasesByItemsService } from './PurchasesByItems.service';
import { PurchasesByItemsPdf } from './PurchasesByItemsPdf';

@Injectable()
export class PurchasesByItemsApplication {
  /**
   * @param {PurchasesByItemsService} purchasesByItemsSheetService - Purchases by items sheet service.
   * @param {PurchasesByItemsTableInjectable} purchasesByItemsTableService - Purchases by items table service.
   * @param {PurchasesByItemsExport} purchasesByItemsExportService - Purchases by items export service.
   * @param {PurchasesByItemsPdf} purchasesByItemsPdfService - Purchases by items pdf service.
   */
  constructor(
    private readonly purchasesByItemsSheetService: PurchasesByItemsService,
    private readonly purchasesByItemsTableService: PurchasesByItemsTableInjectable,
    private readonly purchasesByItemsExportService: PurchasesByItemsExport,
    private readonly purchasesByItemsPdfService: PurchasesByItemsPdf,
  ) {}

  /**
   * Retrieves the purchases by items in json format.
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {Promise<IPurchasesByItemsSheet>}
   */
  public sheet(
    query: IPurchasesByItemsReportQuery,
  ): Promise<IPurchasesByItemsSheet> {
    return this.purchasesByItemsSheetService.purchasesByItems(query);
  }

  /**
   * Retrieves the purchases by items in table format.
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {Promise<IPurchasesByItemsTable>}
   */
  public table(
    query: IPurchasesByItemsReportQuery,
  ): Promise<IPurchasesByItemsTable> {
    return this.purchasesByItemsTableService.table(query);
  }

  /**
   * Retrieves the purchases by items in csv format.
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {Promise<string>}
   */
  public csv(query: IPurchasesByItemsReportQuery): Promise<string> {
    return this.purchasesByItemsExportService.csv(query);
  }

  /**
   * Retrieves the purchases by items in xlsx format.
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: IPurchasesByItemsReportQuery): Promise<Buffer> {
    return this.purchasesByItemsExportService.xlsx(query);
  }

  /**
   * Retrieves the purchases by items in pdf format.
   * @param {IPurchasesByItemsReportQuery} filter
   * @returns {Promise<Buffer>}
   */
  public pdf(filter: IPurchasesByItemsReportQuery): Promise<Buffer> {
    return this.purchasesByItemsPdfService.pdf(filter);
  }
}
