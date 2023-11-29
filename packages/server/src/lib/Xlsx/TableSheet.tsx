import xlsx, { WorkBook } from 'xlsx';
import { IFinancialTable, ITableData } from '@/interfaces';
import { FinancialTableStructure } from '@/services/FinancialStatements/FinancialTableStructure';

interface ITableSheet {
  convertToXLSX(): WorkBook;
  convertToCSV(): string;
  convertToBuffer(workbook: WorkBook, fileType: string): Buffer;
}

export class TableSheet implements ITableSheet {
  private table: ITableData;

  constructor(table: ITableData) {
    this.table = table;
  }

  /**
   * Retrieves the columns labels.
   * @returns {string[]}
   */
  private get columns() {
    return this.table.columns.map((col) => col.label);
  }

  /**
   * Retrieves the columns accessors.
   * @returns {string[]}
   */
  private get columnsAccessors() {
    return this.table.columns.map((col, index) => {
      return `${index}`;
    });
  }

  /**
   * Retrieves the rows data cellIndex/Value.
   * @returns {Record<string, string>}
   */
  private get rows() {
    const computedRows = FinancialTableStructure.flatNestedTree(
      this.table.rows
    );
    return computedRows.map((row) => {
      const entries = row.cells.map((cell, index) => {
        return [`${index}`, cell.value];
      });
      return Object.fromEntries(entries);
    });
  }

  /**
   * Converts the table to a CSV string.
   * @returns {string}
   */
  public convertToCSV(): string {
    // Define custom headers
    const headers = this.columns;

    // Convert data to worksheet with headers
    const worksheet = xlsx.utils.json_to_sheet(this.rows, {
      header: this.columnsAccessors,
    });
    // Add custom headers to the worksheet
    xlsx.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    // Convert worksheet to CSV format
    const csvOutput = xlsx.utils.sheet_to_csv(worksheet);

    return csvOutput;
  }

  /**
   * Convert the array of objects to an XLSX file with styled headers
   * @returns {Workbook}
   */
  public convertToXLSX(): WorkBook {
    // Create a new workbook and a worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(this.rows, {
      header: this.columnsAccessors,
    });
    // Add custom headers to the worksheet
    xlsx.utils.sheet_add_aoa(worksheet, [this.columns], {
      origin: 'A1',
    });
    // Adjust column width.
    worksheet['!cols'] = this.computeXlsxColumnsWidths(this.rows);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    return workbook;
  }

  /**
   * Converts the given workbook to buffer of the given file type
   * @param {WorkBook} workbook
   * @param {string} fileType
   * @returns {Promise<Buffer>}
   */
  public convertToBuffer(workbook: WorkBook, fileType: 'xlsx' | 'csv'): Buffer {
    return xlsx.write(workbook, {
      type: 'buffer',
      bookType: fileType,
      cellStyles: true,
    });
  }

  /**
   * Adjusts and computes the columns width.
   * @param {} rows
   * @returns {{wch: number}[]}
   */
  private computeXlsxColumnsWidths = (rows): { wch: number }[] => {
    const cols = [{ wch: 60 }];

    this.columns.map((column) => {
      cols.push({ wch: column.length });
    });
    rows.forEach((row) => {
      const entries = Object.entries(row);

      entries.forEach(([key, value]) => {
        if (cols[key]) {
          cols[key].wch = Math.max(cols[key].wch, String(value).length);
        } else {
          cols[key] = { wch: String(value).length };
        }
      });
    });
    return cols;
  };
}
