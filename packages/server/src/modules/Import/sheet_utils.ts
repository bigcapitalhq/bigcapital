import * as XLSX from 'xlsx';
import { first } from 'lodash';

/**
 * Parses the given sheet buffer to workbook.
 * @param {Buffer} buffer
 * @returns {XLSX.WorkBook}
 */
export function parseWorkbook(buffer: Buffer): XLSX.WorkBook {
  return XLSX.read(buffer, { type: 'buffer', raw: true });
}

/**
 * Retrieves the first worksheet of the given workbook.
 * @param {XLSX.WorkBook} workbook
 * @returns {XLSX.WorkSheet}
 */
function getFirstSheet(workbook: XLSX.WorkBook): XLSX.WorkSheet {
  const firstSheetName = workbook.SheetNames[0];

  return workbook.Sheets[firstSheetName];
}

/**
 * Parses the given sheet buffer to worksheet.
 * @param {Buffer} buffer
 * @returns {XLSX.WorkSheet}
 */
export function parseFirstSheet(buffer: Buffer): XLSX.WorkSheet {
  return getFirstSheet(parseWorkbook(buffer));
}

/**
 * Extracts the given worksheet to columns.
 * @param {XLSX.WorkSheet} worksheet
 * @returns {Array<string>}
 */
export function extractSheetColumns(worksheet: XLSX.WorkSheet): Array<string> {
  // By default, sheet_to_json scans the first row and uses the values as headers.
  // With the header: 1 option, the function exports an array of arrays of values.
  const sheetCells = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const sheetCols = first(sheetCells) as Array<string>;

  return sheetCols.filter((col) => col);
}

/**
 * Parses the given worksheet to json values. the keys are columns labels.
 * @param {XLSX.WorkSheet} worksheet
 * @returns {Array<Record<string, any>>}
 */
export function parseSheetToJson(
  worksheet: XLSX.WorkSheet,
): Array<Record<string, any>> {
  return XLSX.utils.sheet_to_json(worksheet, {});
}

/**
 * Parses the given sheet buffer then retrieves the sheet data, columns and
 * whether the workbook uses the 1904 date system.
 * @param {Buffer} buffer
 * @returns {[Array<Record<string, any>>, string[], boolean]}
 */
export function parseSheetData(
  buffer: Buffer,
): [Array<Record<string, any>>, string[], boolean] {
  const workbook = parseWorkbook(buffer);
  const worksheet = getFirstSheet(workbook);

  const columns = extractSheetColumns(worksheet);
  const data = parseSheetToJson(worksheet);
  const date1904 = workbook.Workbook?.WBProps?.date1904 ?? false;

  return [data, columns, date1904];
}
