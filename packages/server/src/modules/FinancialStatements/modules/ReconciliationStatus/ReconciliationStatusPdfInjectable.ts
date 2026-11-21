import { Injectable } from '@nestjs/common';
import { escape } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { ReconciliationStatusTableInjectable } from './ReconciliationStatusTableInjectable';
import { ReconciliationStatusQueryDto } from './ReconciliationStatusQuery.dto';
import {
  getReconciliationReportStatusLabel,
  localizeReconciliationStatusCell,
  mapCellValues,
} from './_utils';

const PDF_TABLE_CSS = `
  table .column--deposit,
  table .column--withdrawal,
  table .cell--deposit,
  table .cell--withdrawal { text-align: right; white-space: nowrap; }
  table .row-type--account td,
  table .row-type--opening-balance td,
  table .row-type--closing-balance td { font-weight: 600; }
  table .row-type--account td,
  table .row-type--closing-balance td { border-top: 1px solid #ececec; }
`;

@Injectable()
export class ReconciliationStatusPdfInjectable {
  constructor(
    private readonly reconciliationStatusTable: ReconciliationStatusTableInjectable,
    private readonly i18n: I18nService,
    private readonly tableSheetPdf: TableSheetPdf,
  ) {}

  /**
   * Retrieves the reconciliation status report in PDF format.
   * @param {ReconciliationStatusQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: ReconciliationStatusQueryDto): Promise<Buffer> {
    const { table, meta } = await this.reconciliationStatusTable.table(query);
    const mode = getReconciliationReportStatusLabel(this.i18n, meta.status);

    // The shared PDF template accepts HTML in cells.
    const pdfTable = mapCellValues(table, (cell) =>
      escape(localizeReconciliationStatusCell(this.i18n, cell)),
    );

    return this.tableSheetPdf.convertToPdf(
      pdfTable,
      meta.organizationName,
      this.i18n.t('reconciliation_status.pdf_title', {
        args: { mode },
      }),
      meta.formattedDateRange,
      PDF_TABLE_CSS,
    );
  }
}
