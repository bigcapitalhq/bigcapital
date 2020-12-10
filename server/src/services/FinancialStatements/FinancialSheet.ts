import {
  formatNumber
} from 'utils';

export default class FinancialSheet {
  numberFormat: { noCents: boolean, divideOn1000: boolean };

  /**
   * Formating amount based on the given report query.
   * @param {number} number 
   * @return {string}
   */
  protected formatNumber(number): string {
    return formatNumber(number, this.numberFormat);
  }
}