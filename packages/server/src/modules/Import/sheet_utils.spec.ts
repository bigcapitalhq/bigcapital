import * as XLSX from 'xlsx';
import { parseSheetData } from './sheet_utils';

/**
 * Builds the buffer of an .xlsx file that contains a real date cell, the same
 * way Excel stores it: a number with a date format.
 * @param {number} serial - The Excel date serial number.
 * @param {boolean} [date1904] - Whether the workbook uses the 1904 date system.
 * @returns {Buffer}
 */
const buildXlsxBuffer = (serial: number, date1904 = false): Buffer => {
  const worksheet: XLSX.WorkSheet = {
    '!ref': 'A1:C2',
    A1: { t: 's', v: 'Date' },
    B1: { t: 's', v: 'Payee' },
    C1: { t: 's', v: 'Amount' },
    A2: { t: 'n', v: serial, z: 'yyyy-mm-dd' },
    B2: { t: 's', v: 'ACME' },
    C2: { t: 'n', v: 100 },
  };
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  if (date1904) {
    workbook.Workbook = { WBProps: { date1904: true } };
  }
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
};

describe('parseSheetData', () => {
  it('should return the raw Excel date serial number', () => {
    const buffer = buildXlsxBuffer(46030); // 2026-01-08
    const [data, columns, date1904] = parseSheetData(buffer);

    expect(columns).toEqual(['Date', 'Payee', 'Amount']);
    expect(date1904).toBe(false);
    expect(data).toHaveLength(1);
    expect(data[0].Date).toBe(46030);
    expect(data[0].Payee).toBe('ACME');
    expect(data[0].Amount).toBe(100);
  });

  it('should return the 1904 date system of the workbook', () => {
    const buffer = buildXlsxBuffer(44568, true); // 2026-01-08 in the 1904 system
    const [, , date1904] = parseSheetData(buffer);

    expect(date1904).toBe(true);
  });

  it('should keep text date values untouched', () => {
    const buffer = Buffer.from('Date,Payee,Amount\n2026-01-08,ACME,100\n');
    const [data, columns, date1904] = parseSheetData(buffer);

    expect(columns).toEqual(['Date', 'Payee', 'Amount']);
    expect(date1904).toBe(false);
    expect(data).toHaveLength(1);
    expect(data[0].Date).toBe('2026-01-08');
  });
});
