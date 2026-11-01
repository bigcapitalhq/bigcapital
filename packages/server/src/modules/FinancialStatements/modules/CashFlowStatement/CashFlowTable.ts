import { flow, constant } from 'fp-ts/function';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { when } from '@/common/fp';
import {
  ICashFlowStatementSection,
  ICashFlowStatementSectionType,
  IDateRange,
  ICashFlowStatementDOO,
} from './Cashflow.types';
import {
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '../../types/Table.types';
import { dateRangeFromToCollection } from '@/utils/date-range-collection';
import { tableRowMapper } from '../../utils/Table.utils';
import { mapValuesDeep } from '@/utils/deepdash';
import { CASH_FLOW_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

enum IROW_TYPE {
  AGGREGATE = 'AGGREGATE',
  NET_INCOME = 'NET_INCOME',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT = 'ACCOUNT',
  TOTAL = 'TOTAL',
}
const DEEP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };
const DISPLAY_COLUMNS_BY = {
  DATE_PERIODS: 'date_periods',
  TOTAL: 'total',
};

export class CashFlowTable {
  private report: ICashFlowStatementDOO;
  private i18n: I18nService;
  private dateRangeSet: IDateRange[];

  /**
   * Constructor method.
   * @param {ICashFlowStatement} reportStatement - Statement.
   * @param {I18nService} i18n - I18n service.
   */
  constructor(reportStatement: ICashFlowStatementDOO, i18n: I18nService) {
    this.report = reportStatement;
    this.i18n = i18n;
    this.dateRangeSet = [];
    this.initDateRangeCollection();
  }

  /**
   * Initialize date range set.
   */
  private initDateRangeCollection() {
    this.dateRangeSet = dateRangeFromToCollection(
      this.report.query.fromDate,
      this.report.query.toDate,
      this.report.query.displayColumnsBy as moment.unitOfTime.StartOf,
    );
  }

  /**
   * Retrieve the date periods columns accessors.
   */
  private datePeriodsColumnsAccessors = () => {
    return this.dateRangeSet.map((dateRange: IDateRange, index) => ({
      key: `date-range-${index}`,
      accessor: `periods[${index}].total.formattedAmount`,
    }));
  };

  /**
   * Retrieve the total column accessor.
   */
  private totalColumnAccessor = () => {
    return [
      { key: CASH_FLOW_COLUMN_KEYS.TOTAL, accessor: 'total.formattedAmount' },
    ];
  };

  /**
   * Retrieve the common columns for all report nodes.
   */
  private commonColumns = () => {
    return flow(
      (columns: ITableColumnAccessor[]) => [
        ...this.totalColumnAccessor(),
        ...columns,
      ],
      when(
        constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        (columns: ITableColumnAccessor[]) => [
          ...this.datePeriodsColumnsAccessors(),
          ...columns,
        ],
      ),
      (columns: ITableColumnAccessor[]) => [
        { key: CASH_FLOW_COLUMN_KEYS.NAME, accessor: 'label' },
        ...columns,
      ],
    )([]);
  };

  /**
   * Retrieve the table rows of regular section.
   * @param {ICashFlowStatementSection} section
   * @returns {ITableRow[]}
   */
  private regularSectionMapper = (
    section: ICashFlowStatementSection,
  ): ITableRow => {
    const columns = this.commonColumns();

    return tableRowMapper(section, columns, {
      rowTypes: [IROW_TYPE.AGGREGATE],
      id: section.id,
    });
  };

  /**
   * Retrieve the net income table rows of the section.
   * @param {ICashFlowStatementSection} section
   * @returns {ITableRow}
   */
  private netIncomeSectionMapper = (
    section: ICashFlowStatementSection,
  ): ITableRow => {
    const columns = this.commonColumns();

    return tableRowMapper(section, columns, {
      rowTypes: [IROW_TYPE.NET_INCOME, IROW_TYPE.TOTAL],
      id: section.id,
    });
  };

  /**
   * Retrieve the accounts table rows of the section.
   * @param {ICashFlowStatementSection} section
   * @returns {ITableRow}
   */
  private accountsSectionMapper = (
    section: ICashFlowStatementSection,
  ): ITableRow => {
    const columns = this.commonColumns();

    return tableRowMapper(section, columns, {
      rowTypes: [IROW_TYPE.ACCOUNTS],
      id: section.id,
    });
  };

  /**
   * Retrieve the account table row of account section.
   * @param {ICashFlowStatementSection} section
   * @returns {ITableRow}
   */
  private accountSectionMapper = (
    section: ICashFlowStatementSection,
  ): ITableRow => {
    const columns = this.commonColumns();

    return tableRowMapper(section, columns, {
      rowTypes: [IROW_TYPE.ACCOUNT],
      id: `account-${section.id}`,
    });
  };

  /**
   * Retrieve the total table rows from the given total section.
   * @param {ICashFlowStatementSection} section
   * @returns {ITableRow}
   */
  private totalSectionMapper = (
    section: ICashFlowStatementSection,
  ): ITableRow => {
    const columns = this.commonColumns();

    return tableRowMapper(section, columns, {
      rowTypes: [IROW_TYPE.TOTAL],
      id: section.id,
    });
  };

  /**
   * Detarmines the schema section type.
   * @param {string} type
   * @param {ICashFlowSchemaSection} section
   * @returns {boolean}
   */
  private isSectionHasType = (type: string, section): boolean => {
    return type === section.sectionType;
  };

  /**
   * The report section mapper.
   * @param {ICashFlowStatementSection} section
   * @returns {ITableRow}
   */
  private sectionMapper = (
    section: ICashFlowStatementSection,
    _key: string,
    _parentSection: ICashFlowStatementSection,
  ): ITableRow => {
    return flow(
      when(
        (section: any) =>
          this.isSectionHasType(
            ICashFlowStatementSectionType.AGGREGATE,
            section,
          ),
        this.regularSectionMapper,
      ),
      when(
        (section: any) =>
          this.isSectionHasType(
            ICashFlowStatementSectionType.CASH_AT_BEGINNING,
            section,
          ),
        this.regularSectionMapper,
      ),
      when(
        (section: any) =>
          this.isSectionHasType(
            ICashFlowStatementSectionType.NET_INCOME,
            section,
          ),
        this.netIncomeSectionMapper,
      ),
      when(
        (section: any) =>
          this.isSectionHasType(
            ICashFlowStatementSectionType.ACCOUNTS,
            section,
          ),
        this.accountsSectionMapper,
      ),
      when(
        (section: any) =>
          this.isSectionHasType(ICashFlowStatementSectionType.ACCOUNT, section),
        this.accountSectionMapper,
      ),
      when(
        (section: any) =>
          this.isSectionHasType(ICashFlowStatementSectionType.TOTAL, section),
        this.totalSectionMapper,
      ),
    )(section);
  };

  /**
   * Mappes the sections to the table rows.
   * @param {ICashFlowStatementSection[]} sections
   * @returns {ITableRow[]}
   */
  private mapSectionsToTableRows = (
    sections: ICashFlowStatementSection[],
  ): ITableRow[] => {
    return mapValuesDeep(sections, this.sectionMapper.bind(this), DEEP_CONFIG);
  };

  /**
   * Appends the total to section's children.
   * @param {ICashFlowStatementSection} section
   * @returns {ICashFlowStatementSection}
   */
  private appendTotalToSectionChildren = (
    section,
  ): ICashFlowStatementSection => {
    const label = section.footerLabel
      ? this.i18n.t(section.footerLabel)
      : this.i18n.t('financial_sheet.total_row', {
          args: { value: section.label },
        });
    section.children.push({
      sectionType: ICashFlowStatementSectionType.TOTAL,
      label,
      periods: section.periods,
      total: section.total,
    });
    return section;
  };

  /**
   *
   * @param {ICashFlowStatementSection} section
   * @returns {ICashFlowStatementSection}
   */
  private mapSectionsToAppendTotalChildren = (
    section: ICashFlowStatementSection,
  ): ICashFlowStatementSection => {
    const isSectionHasChildren = (section) => !isEmpty(section.children);

    return when(
      isSectionHasChildren,
      this.appendTotalToSectionChildren.bind(this),
    )(section);
  };

  /**
   * Appends total node to children section.
   * @param {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private appendTotalToChildren = (sections) => {
    return mapValuesDeep(
      sections,
      this.mapSectionsToAppendTotalChildren.bind(this),
      DEEP_CONFIG,
    );
  };

  /**
   * Retrieve the table rows of cash flow statement.
   * @param {ICashFlowStatementSection[]} sections
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    const sections = this.report.data;

    return flow(
      this.appendTotalToChildren,
      this.mapSectionsToTableRows,
    )(sections);
  };

  /**
   * Retrieve the total columns.
   * @returns {ITableColumn}
   */
  private totalColumns = (): ITableColumn[] => {
    return [
      {
        key: CASH_FLOW_COLUMN_KEYS.TOTAL,
        label: this.i18n.t('cash_flow_statement.total'),
      },
    ];
  };

  /**
   * Retrieve the formatted column label from the given date range.
   * @param {IDateRange} dateRange -
   * @return {string}
   */
  private formatColumnLabel = (dateRange: IDateRange): string => {
    const monthFormat = (range) => moment(range.toDate).format('YYYY-MM');
    const yearFormat = (range) => moment(range.toDate).format('YYYY');
    const dayFormat = (range) => moment(range.toDate).format('YYYY-MM-DD');

    if (this.isDisplayColumnsType('month')) {
      return monthFormat(dateRange);
    } else if (this.isDisplayColumnsType('year')) {
      return yearFormat(dateRange);
    } else if (this.isDisplayColumnsType('day')) {
      return dayFormat(dateRange);
    } else if (this.isDisplayColumnsType('quarter')) {
      return monthFormat(dateRange);
    } else if (this.isDisplayColumnsType('week')) {
      return dayFormat(dateRange);
    }
  };

  /**
   * Date periods columns.
   * @returns {ITableColumn[]}
   */
  private datePeriodsColumns = (): ITableColumn[] => {
    return this.dateRangeSet.map((dateRange, index) => ({
      key: `date-range-${index}`,
      label: this.formatColumnLabel(dateRange),
    }));
  };

  /**
   * Determines the given column type is the current.
   * @reutrns {boolean}
   */
  private isDisplayColumnsBy = (displayColumnsType: string): boolean => {
    return this.report.query.displayColumnsType === displayColumnsType;
  };

  /**
   * Determines whether the given display columns type is the current.
   * @param {string} displayColumnsBy
   * @returns {boolean}
   */
  private isDisplayColumnsType = (displayColumnsBy: string): boolean => {
    return this.report.query.displayColumnsBy === displayColumnsBy;
  };

  /**
   * Retrieve the table columns.
   * @return {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return flow(
      (columns: ITableColumn[]) => [...this.totalColumns(), ...columns],
      when(
        constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        (columns: ITableColumn[]) => [...this.datePeriodsColumns(), ...columns],
      ),
      (columns: ITableColumn[]) => [
        {
          key: CASH_FLOW_COLUMN_KEYS.NAME,
          label: this.i18n.t('cash_flow_statement.account_name'),
        },
        ...columns,
      ],
    )([]);
  };
}
