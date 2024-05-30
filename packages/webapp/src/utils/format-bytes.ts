/**
 * Converts a number of bytes into a human-readable string with units.
 * The function takes the number of bytes and an optional number of decimal places,
 * then calculates the appropriate unit (Bytes, KB, MB, etc.) and formats the number.
 * @param {number} bytes - The number of bytes to format.
 * @param {number} decimals - The number of decimal places to include in the formatted string.
 * @returns {string} The formatted string with the appropriate unit.
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k: number = 1024;
  const dm: number = decimals < 0 ? 0 : decimals;
  const sizes: string[] = [
    'Bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB',
  ];
  const i: number = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
