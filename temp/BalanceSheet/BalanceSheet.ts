import * as R from 'ramda';
import { I18nService } from 'nestjs-i18n';
import {
  IBalanceSheetQuery,
  IBalanceSheetSchemaNode,
  IBalanceSheetDataNode,
} from './BalanceSheet.types';
import { BalanceSheetSchema } from './BalanceSheetSchema';
import { BalanceSheetPercentage } from './BalanceSheetPercentage';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { BalanceSheetDatePeriods } from './BalanceSheetDatePeriods';
import { BalanceSheetBase } from './BalanceSheetBase';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { BalanceSheetRepository } from './BalanceSheetRepository';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetFiltering } from './BalanceSheetFiltering';
import { BalanceSheetNetIncome } from './BalanceSheetNetIncome';
import { BalanceSheetAggregators } from './BalanceSheetAggregators';
import { BalanceSheetAccounts } from './BalanceSheetAccounts';
import { INumberFormatQuery } from '../../types/Report.types';
import { FinancialSheet } from '../../common/FinancialSheet';

export class BalanceSheet extends R.pipe(
  BalanceSheetAggregators,
  BalanceSheetAccounts,
  BalanceSheetNetIncome,
  BalanceSheetFiltering,
  BalanceSheetDatePeriods,
  BalanceSheetComparsionPreviousPeriod,
  BalanceSheetComparsionPreviousYear,
  BalanceSheetPercentage,
  BalanceSheetSchema,
  BalanceSheetBase,
  FinancialSheetStructure,
)(FinancialSheet) {
  /**
   * Balance sheet query.
   * @param {BalanceSheetQuery}
   */
  readonly query: BalanceSheetQuery;

  /**
   * Balance sheet number format query.
   * @param {INumberFormatQuery}
   */
  readonly numberFormat: INumberFormatQuery;

  /**
   * Base currency of the organization.
   * @param {string}
   */
  readonly baseCurrency: string;

  /**
   * Localization.
   */
  readonly i18n: I18nService;

  /**
   * Balance sheet repository.
   */
  readonly repository: BalanceSheetRepository;

  /**
   * Constructor method.
   * @param {IBalanceSheetQuery} query -
   * @param {IAccount[]} accounts -
   * @param {string} baseCurrency -
   */
  constructor(
    query: IBalanceSheetQuery,
    repository: BalanceSheetRepository,
    baseCurrency: string,
    i18n: I18nService,
  ) {
    super();

    this.query = new BalanceSheetQuery(query);
    this.repository = repository;
    this.baseCurrency = baseCurrency;
    this.numberFormat = this.query.query.numberFormat;
    this.i18n = i18n;
  }

  /**
   * Parses report schema nodes.
   * @param {IBalanceSheetSchemaNode[]} schema
   * @returns {IBalanceSheetDataNode[]}
   */
  public parseSchemaNodes = (
    schema: IBalanceSheetSchemaNode[],
  ): IBalanceSheetDataNode[] => {
    return R.compose(
      this.aggregatesSchemaParser,
      this.netIncomeSchemaParser,
      this.accountsSchemaParser,
    )(schema) as IBalanceSheetDataNode[];
  };

  /**
   * Retrieve the report statement data.
   * @returns {IBalanceSheetDataNode[]}
   */
  public reportData = () => {
    const balanceSheetSchema = this.getSchema();

    return R.compose(
      this.reportFilterPlugin,
      this.reportPercentageCompose,
      this.parseSchemaNodes,
    )(balanceSheetSchema);
  };
}
