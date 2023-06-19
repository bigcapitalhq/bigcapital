import moment from 'moment';
import {
  ICashFlowStatementTotal,
  IFormatNumberSettings,
  INumberFormatQuery,
} from '@/interfaces';
import { formatNumber } from 'utils';

export default class FinancialSheet {
  readonly numberFormat: INumberFormatQuery = {
    precision: 2,
    divideOn1000: false,
    showZero: false,
    formatMoney: 'total',
    negativeFormat: 'mines',
  };
  readonly baseCurrency: string;

  /**
   * Transformes the number format query to settings
   */
  protected transformFormatQueryToSettings(): IFormatNumberSettings {
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
   * @param  {number} number -
   * @param  {IFormatNumberSettings} overrideSettings -
   * @return {string}
   */
  protected formatNumber(
    number,
    overrideSettings: IFormatNumberSettings = {}
  ): string {
    const settings = {
      ...this.transformFormatQueryToSettings(),
      ...overrideSettings,
    };
    return formatNumber(number, settings);
  }

  /**
   * Formatting full amount with different format settings.
   * @param {number} amount -
   * @param {IFormatNumberSettings} settings -
   */
  protected formatTotalNumber = (
    amount: number,
    settings: IFormatNumberSettings = {}
  ): string => {
    const { numberFormat } = this;

    return this.formatNumber(amount, {
      money: numberFormat.formatMoney === 'none' ? false : true,
      excerptZero: false,
      ...settings,
    });
  };

  /**
   * Formates the amount to the percentage string.
   * @param   {number} amount
   * @returns {string}
   */
  protected formatPercentage = (
    amount: number,
    overrideSettings: IFormatNumberSettings = {}
  ): string => {
    const percentage = amount * 100;
    const settings = {
      excerptZero: true,
      ...overrideSettings,
      symbol: '%',
      money: false,
    };
    return formatNumber(percentage, settings);
  };

  /**
   * Format the given total percentage.
   * @param {number} amount -
   * @param {IFormatNumberSettings} settings -
   */
  protected formatTotalPercentage = (
    amount: number,
    settings: IFormatNumberSettings = {}
  ): string => {
    return this.formatPercentage(amount, {
      ...settings,
      excerptZero: false,
    });
  };

  /**
   * Retrieve the amount meta object.
   * @param {number} amount
   * @returns {ICashFlowStatementTotal}
   */
  protected getAmountMeta(
    amount: number,
    overrideSettings?: IFormatNumberSettings
  ): ICashFlowStatementTotal {
    return {
      amount,
      formattedAmount: this.formatNumber(amount, overrideSettings),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the total amount meta object.
   * @param {number} amount
   * @returns {ICashFlowStatementTotal}
   */
  protected getTotalAmountMeta(
    amount: number,
    title?: string
  ): ICashFlowStatementTotal {
    return {
      ...(title ? { title } : {}),
      amount,
      formattedAmount: this.formatTotalNumber(amount),
      currencyCode: this.baseCurrency,
    };
  }

  /**
   * Retrieve the date meta.
   * @param {Date} date
   * @param {string} format
   * @returns
   */
  protected getDateMeta(date: Date, format = 'YYYY-MM-DD') {
    return {
      formattedDate: moment(date).format(format),
      date: moment(date).toDate(),
    };
  }

  getPercentageBasis = (base, amount) => {
    return base ? amount / base : 0;
  };

  getAmountChange = (base, amount) => {
    return base - amount;
  };

  protected getPercentageAmountMeta = (amount) => {
    const formattedAmount = this.formatPercentage(amount);

    return {
      amount,
      formattedAmount,
    };
  };

  /**
   * Re
   * @param {number} amount
   * @returns
   */
  protected getPercentageTotalAmountMeta = (amount: number) => {
    const formattedAmount = this.formatTotalPercentage(amount);

    return { amount, formattedAmount };
  };
}
