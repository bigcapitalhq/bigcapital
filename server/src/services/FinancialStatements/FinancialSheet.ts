import { IFormatNumberSettings, INumberFormatQuery } from 'interfaces';
import { formatNumber } from 'utils';

export default class FinancialSheet {
  readonly numberFormat: INumberFormatQuery;
  readonly baseCurrency: string;

  /**
   * Transformes the number format query to settings
   */
  protected transfromFormatQueryToSettings(): IFormatNumberSettings {
    const { numberFormat } = this;

    return {
      precision: numberFormat.precision,
      divideOn1000: numberFormat.divideOn1000,
      excerptZero: !numberFormat.showZero,
      negativeFormat: numberFormat.negativeFormat,
      money: numberFormat.formatMoney === 'always',
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Formating amount based on the given report query.
   * @param {number} number -
   * @param {IFormatNumberSettings} overrideSettings -
   * @return {string}
   */
  protected formatNumber(
    number,
    overrideSettings: IFormatNumberSettings = {}
  ): string {
    const settings = {
      ...this.transfromFormatQueryToSettings(),
      ...overrideSettings,
    };
    return formatNumber(number, settings);
  }
  
  /**
   * Formatting full amount with different format settings.
   * @param {number} amount -
   * @param {IFormatNumberSettings} settings -
   */
  protected formatTotalNumber(
    amount: number,
    settings: IFormatNumberSettings = {}
  ): string {
    const { numberFormat } = this;

    return this.formatNumber(amount, {
      money: numberFormat.formatMoney === 'none' ? false : true,
      excerptZero: false,
      ...settings
    });
  }


  protected formatPercentage(
    amount
  ): string {
    return `%${amount * 100}`;
  }
}
