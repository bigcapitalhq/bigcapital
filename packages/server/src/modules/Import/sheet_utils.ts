import XLSX from 'xlsx';
import { first } from 'lodash';

/**
 * Parses the given sheet buffer to worksheet.
 * @param {Buffer} buffer
 * @returns {XLSX.WorkSheet}
 */
export function parseFirstSheet(buffer: Buffer): XLSX.WorkSheet {
  const workbook = XLSX.read(buffer, { type: 'buffer', raw: true });

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  return worksheet;
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
 * @returns {Array<Record<string, string>>}
 */
export function parseSheetToJson(
  worksheet: XLSX.WorkSheet
): Array<Record<string, string>> {
  return XLSX.utils.sheet_to_json(worksheet, {});
}

/**
 * Parses the given sheet buffer then retrieves the sheet data and columns.
 * @param {Buffer} buffer
 */
export function parseSheetData(
  buffer: Buffer
): [Array<Record<string, string>>, string[]] {
  const worksheet = parseFirstSheet(buffer);

  const columns = extractSheetColumns(worksheet);
  const data = parseSheetToJson(worksheet);

  return [data, columns];
}
