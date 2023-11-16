import { IFinancialTable, ITableData } from '@/interfaces';
import xlsx, { WorkBook } from 'xlsx';

interface ITableSheet {
  convertToXLSX(): ITableData;
  convertToCSV(): string;
  convertToBuffer(table: IFinancialTable, fileType: string): Buffer;
}

export class TableSheet {
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
    return this.table.rows.map((row) => {
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
  public convertToCSV() {
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
    // Adjust column width (optional)
    worksheet['!cols'] = [{ wch: 15 }, { wch: 20 }];

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
  public convertToBuffer(workbook: WorkBook, fileType: 'xlsx' | 'csv') {
    return xlsx.write(workbook, { type: 'buffer', bookType: fileType });
  }
}
