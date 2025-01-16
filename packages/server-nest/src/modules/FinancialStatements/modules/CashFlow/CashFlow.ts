import * as R from 'ramda';
import { defaultTo, map, set, sumBy, isEmpty, mapValues, get } from 'lodash';
import * as mathjs from 'mathjs';
import moment from 'moment';
import { compose } from 'lodash/fp';
import {
  IAccount,
  ILedger,
  INumberFormatQuery,
  ICashFlowSchemaSection,
  ICashFlowStatementQuery,
  ICashFlowStatementNetIncomeSection,
  ICashFlowStatementAccountSection,
  ICashFlowSchemaSectionAccounts,
  ICashFlowStatementAccountMeta,
  ICashFlowSchemaAccountRelation,
  ICashFlowStatementSectionType,
  ICashFlowStatementData,
  ICashFlowSchemaTotalSection,
  ICashFlowStatementTotalSection,
  ICashFlowStatementSection,
  ICashFlowCashBeginningNode,
  ICashFlowStatementAggregateSection,
} from '@/interfaces';
import CASH_FLOW_SCHEMA from './schema';
import FinancialSheet from '../FinancialSheet';
import { transformToMapBy, accumSum } from 'utils';
import { ACCOUNT_ROOT_TYPE } from '@/data/AccountTypes';
import { CashFlowStatementDatePeriods } from './CashFlowDatePeriods';
import I18nService from '@/services/I18n/I18nService';
import { DISPLAY_COLUMNS_BY } from './constants';
import { FinancialSheetStructure } from '../FinancialSheetStructure';

export default class CashFlowStatement extends compose(
  CashFlowStatementDatePeriods,
  FinancialSheetStructure
)(FinancialSheet) {
  readonly baseCurrency: string;
  readonly i18n: I18nService;
  readonly sectionsByIds = {};
  readonly cashFlowSchemaMap: Map<string, ICashFlowSchemaSection>;
  readonly cashFlowSchemaSeq: Array<string>;
  readonly accountByTypeMap: Map<string, IAccount[]>;
  readonly accountsByRootType: Map<string, IAccount[]>;
  readonly ledger: ILedger;
  readonly cashLedger: ILedger;
  readonly netIncomeLedger: ILedger;
  readonly query: ICashFlowStatementQuery;
  readonly numberFormat: INumberFormatQuery;
  readonly comparatorDateType: string;
  readonly dateRangeSet: { fromDate: Date; toDate: Date }[];

  /**
   * Constructor method.
   * @constructor
   */
  constructor(
    accounts: IAccount[],
    ledger: ILedger,
    cashLedger: ILedger,
    netIncomeLedger: ILedger,
    query: ICashFlowStatementQuery,
    baseCurrency: string,
    i18n
  ) {
    super();

    this.baseCurrency = baseCurrency;
    this.i18n = i18n;
    this.ledger = ledger;
    this.cashLedger = cashLedger;
    this.netIncomeLedger = netIncomeLedger;
    this.accountByTypeMap = transformToMapBy(accounts, 'accountType');
    this.accountsByRootType = transformToMapBy(accounts, 'accountRootType');
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.dateRangeSet = [];
    this.comparatorDateType =
      query.displayColumnsType === 'total' ? 'day' : query.displayColumnsBy;

    this.initDateRangeCollection();
  }

  // --------------------------------------------
  // # GENERAL UTILITIES
  // --------------------------------------------
  /**
   * Retrieve the expense accounts ids.
   * @return {number[]}
   */
  private getAccountsIdsByType = (accountType: string): number[] => {
    const expenseAccounts = this.accountsByRootType.get(accountType);
    const expenseAccountsIds = map(expenseAccounts, 'id');

    return expenseAccountsIds;
  };

  /**
   * Detarmines the given display columns by type.
   * @param {string} displayColumnsBy
   * @returns {boolean}
   */
  private isDisplayColumnsBy = (displayColumnsBy: string): boolean => {
    return this.query.displayColumnsType === displayColumnsBy;
  };

  /**
   * Adjustments the given amount.
   * @param {string} direction
   * @param {number} amount -
   * @return {number}
   */
  private amountAdjustment = (direction: 'mines' | 'plus', amount): number => {
    return R.when(
      R.always(R.equals(direction, 'mines')),
      R.multiply(-1)
    )(amount);
  };

  // --------------------------------------------
  // # NET INCOME NODE
  // --------------------------------------------
  /**
   * Retrieve the accounts net income.
   * @returns {number} - Amount of net income.
   */
  private getAccountsNetIncome(): number {
    // Mapping income/expense accounts ids.
    const incomeAccountsIds = this.getAccountsIdsByType(
      ACCOUNT_ROOT_TYPE.INCOME
    );
    const expenseAccountsIds = this.getAccountsIdsByType(
      ACCOUNT_ROOT_TYPE.EXPENSE
    );
    // Income closing balance.
    const incomeClosingBalance = accumSum(incomeAccountsIds, (id) =>
      this.netIncomeLedger.whereAccountId(id).getClosingBalance()
    );
    // Expense closing balance.
    const expenseClosingBalance = accumSum(expenseAccountsIds, (id) =>
      this.netIncomeLedger.whereAccountId(id).getClosingBalance()
    );
    // Net income = income - expenses.
    const netIncome = incomeClosingBalance - expenseClosingBalance;

    return netIncome;
  }

  /**
   * Parses the net income section from the given section schema.
   * @param   {ICashFlowSchemaSection} nodeSchema - Report section schema.
   * @returns {ICashFlowStatementNetIncomeSection}
   */
  private netIncomeSectionMapper = (
    nodeSchema: ICashFlowSchemaSection
  ): ICashFlowStatementNetIncomeSection => {
    const netIncome = this.getAccountsNetIncome();

    const node = {
      id: nodeSchema.id,
      label: this.i18n.__(nodeSchema.label),
      total: this.getAmountMeta(netIncome),
      sectionType: ICashFlowStatementSectionType.NET_INCOME,
    };
    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocPeriodsToNetIncomeNode
      )
    )(node);
  };

  // --------------------------------------------
  // # ACCOUNT NODE
  // --------------------------------------------
  /**
   * Retrieve account meta.
   * @param   {ICashFlowSchemaAccountRelation} relation - Account relation.
   * @param   {IAccount} account -
   * @returns {ICashFlowStatementAccountMeta}
   */
  private accountMetaMapper = (
    relation: ICashFlowSchemaAccountRelation,
    account: IAccount
  ): ICashFlowStatementAccountMeta => {
    // Retrieve the closing balance of the given account.
    const getClosingBalance = (id) =>
      this.ledger.whereAccountId(id).getClosingBalance();

    const closingBalance = R.compose(
      // Multiplies the amount by -1 in case the relation in mines.
      R.curry(this.amountAdjustment)(relation.direction)
    )(getClosingBalance(account.id));

    const node = {
      id: account.id,
      code: account.code,
      label: account.name,
      accountType: account.accountType,
      adjustmentType: relation.direction,
      total: this.getAmountMeta(closingBalance),
      sectionType: ICashFlowStatementSectionType.ACCOUNT,
    };
    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocPeriodsToAccountNode
      )
    )(node);
  };

  /**
   * Retrieve accounts sections by the given schema relation.
   * @param   {ICashFlowSchemaAccountRelation} relation
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getAccountsBySchemaRelation = (
    relation: ICashFlowSchemaAccountRelation
  ): ICashFlowStatementAccountMeta[] => {
    const accounts = defaultTo(this.accountByTypeMap.get(relation.type), []);
    const accountMetaMapper = R.curry(this.accountMetaMapper)(relation);
    return R.map(accountMetaMapper)(accounts);
  };

  /**
   * Retrieve the accounts meta.
   * @param   {string[]} types
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getAccountsBySchemaRelations = (
    relations: ICashFlowSchemaAccountRelation[]
  ): ICashFlowStatementAccountMeta[] => {
    return R.pipe(
      R.append(R.map(this.getAccountsBySchemaRelation)(relations)),
      R.flatten
    )([]);
  };

  /**
   * Calculates the accounts total
   * @param   {ICashFlowStatementAccountMeta[]} accounts
   * @returns {number}
   */
  private getAccountsMetaTotal = (
    accounts: ICashFlowStatementAccountMeta[]
  ): number => {
    return sumBy(accounts, 'total.amount');
  };

  /**
   * Retrieve the accounts section from the section schema.
   * @param   {ICashFlowSchemaSectionAccounts} sectionSchema
   * @returns {ICashFlowStatementAccountSection}
   */
  private accountsSectionParser = (
    sectionSchema: ICashFlowSchemaSectionAccounts
  ): ICashFlowStatementAccountSection => {
    const { accountsRelations } = sectionSchema;

    const accounts = this.getAccountsBySchemaRelations(accountsRelations);
    const accountsTotal = this.getAccountsMetaTotal(accounts);
    const total = this.getTotalAmountMeta(accountsTotal);

    const node = {
      sectionType: ICashFlowStatementSectionType.ACCOUNTS,
      id: sectionSchema.id,
      label: this.i18n.__(sectionSchema.label),
      footerLabel: this.i18n.__(sectionSchema.footerLabel),
      children: accounts,
      total,
    };
    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocPeriodsToAggregateNode
      )
    )(node);
  };

  /**
   * Detarmines the schema section type.
   * @param   {string} type
   * @param   {ICashFlowSchemaSection} section
   * @returns {boolean}
   */
  private isSchemaSectionType = R.curry(
    (type: string, section: ICashFlowSchemaSection): boolean => {
      return type === section.sectionType;
    }
  );

  // --------------------------------------------
  // # AGGREGATE NODE
  // --------------------------------------------
  /**
   * Aggregate schema node parser to aggregate report node.
   * @param   {ICashFlowSchemaSection} schemaSection
   * @returns {ICashFlowStatementAggregateSection}
   */
  private regularSectionParser = R.curry(
    (
      children,
      schemaSection: ICashFlowSchemaSection
    ): ICashFlowStatementAggregateSection => {
      const node = {
        id: schemaSection.id,
        label: this.i18n.__(schemaSection.label),
        footerLabel: this.i18n.__(schemaSection.footerLabel),
        sectionType: ICashFlowStatementSectionType.AGGREGATE,
        children,
      };
      return R.compose(
        R.when(
          this.isSchemaSectionType(ICashFlowStatementSectionType.AGGREGATE),
          this.assocRegularSectionTotal
        ),
        R.when(
          this.isSchemaSectionType(ICashFlowStatementSectionType.AGGREGATE),
          R.when(
            R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
            this.assocPeriodsToAggregateNode
          )
        )
      )(node);
    }
  );

  private transformSectionsToMap = (sections: ICashFlowSchemaSection[]) => {
    return this.reduceNodesDeep(
      sections,
      (acc, section) => {
        if (section.id) {
          acc[`${section.id}`] = section;
        }
        return acc;
      },
      {}
    );
  };

  // --------------------------------------------
  // # TOTAL EQUATION NODE
  // --------------------------------------------

  private sectionsMapToTotal = (mappedSections: { [key: number]: any }) => {
    return mapValues(mappedSections, (node) => get(node, 'total.amount') || 0);
  };

  /**
   * Evauluate equaation string with the given scope table.
   * @param  {string} equation -
   * @param  {{ [key: string]: number }} scope -
   * @return {number}
   */
  private evaluateEquation = (
    equation: string,
    scope: { [key: string | number]: number }
  ): number => {
    return mathjs.evaluate(equation, scope);
  };

  /**
   * Retrieve the total section from the eqauation parser.
   * @param   {ICashFlowSchemaTotalSection} sectionSchema
   * @param   {ICashFlowSchemaSection[]} accumulatedSections
   * @returns {ICashFlowStatementTotalSection}
   */
  private totalEquationSectionParser = (
    accumulatedSections: ICashFlowSchemaSection[],
    sectionSchema: ICashFlowSchemaTotalSection
  ): ICashFlowStatementTotalSection => {
    const mappedSectionsById = this.transformSectionsToMap(accumulatedSections);
    const nodesTotalById = this.sectionsMapToTotal(mappedSectionsById);

    const total = this.evaluateEquation(sectionSchema.equation, nodesTotalById);

    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        R.curry(this.assocTotalEquationDatePeriods)(
          mappedSectionsById,
          sectionSchema.equation
        )
      )
    )({
      sectionType: ICashFlowStatementSectionType.TOTAL,
      id: sectionSchema.id,
      label: this.i18n.__(sectionSchema.label),
      total: this.getTotalAmountMeta(total),
    });
  };

  /**
   * Retrieve the beginning cash from date.
   * @param  {Date|string} fromDate -
   * @return {Date}
   */
  private beginningCashFrom = (fromDate: string | Date): Date => {
    return moment(fromDate).subtract(1, 'days').toDate();
  };

  /**
   * Retrieve account meta.
   * @param   {ICashFlowSchemaAccountRelation} relation
   * @param   {IAccount} account
   * @returns {ICashFlowStatementAccountMeta}
   */
  private cashAccountMetaMapper = (
    relation: ICashFlowSchemaAccountRelation,
    account: IAccount
  ): ICashFlowStatementAccountMeta => {
    const cashToDate = this.beginningCashFrom(this.query.fromDate);

    const closingBalance = this.cashLedger
      .whereToDate(cashToDate)
      .whereAccountId(account.id)
      .getClosingBalance();

    const node = {
      id: account.id,
      code: account.code,
      label: account.name,
      accountType: account.accountType,
      adjustmentType: relation.direction,
      total: this.getAmountMeta(closingBalance),
      sectionType: ICashFlowStatementSectionType.ACCOUNT,
    };
    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocCashAtBeginningAccountDatePeriods
      )
    )(node);
  };

  /**
   * Retrieve accounts sections by the given schema relation.
   * @param   {ICashFlowSchemaAccountRelation} relation
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getCashAccountsBySchemaRelation = (
    relation: ICashFlowSchemaAccountRelation
  ): ICashFlowStatementAccountMeta[] => {
    const accounts = this.accountByTypeMap.get(relation.type) || [];
    const accountMetaMapper = R.curry(this.cashAccountMetaMapper)(relation);
    return accounts.map(accountMetaMapper);
  };

  /**
   * Retrieve the accounts meta.
   * @param {string[]} types
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getCashAccountsBySchemaRelations = (
    relations: ICashFlowSchemaAccountRelation[]
  ): ICashFlowStatementAccountMeta[] => {
    return R.concat(...R.map(this.getCashAccountsBySchemaRelation)(relations));
  };

  /**
   * Parses the cash at beginning section.
   * @param  {ICashFlowSchemaTotalSection} sectionSchema -
   * @return {ICashFlowCashBeginningNode}
   */
  private cashAtBeginningSectionParser = (
    nodeSchema: ICashFlowSchemaSection
  ): ICashFlowCashBeginningNode => {
    const { accountsRelations } = nodeSchema;
    const children = this.getCashAccountsBySchemaRelations(accountsRelations);
    const total = this.getAccountsMetaTotal(children);

    const node = {
      sectionType: ICashFlowStatementSectionType.CASH_AT_BEGINNING,
      id: nodeSchema.id,
      label: this.i18n.__(nodeSchema.label),
      children,
      total: this.getTotalAmountMeta(total),
    };
    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocCashAtBeginningDatePeriods
      )
    )(node);
  };

  /**
   * Parses the schema section.
   * @param   {ICashFlowSchemaSection} schemaNode
   * @returns {ICashFlowSchemaSection}
   */
  private schemaSectionParser = (
    schemaNode: ICashFlowSchemaSection,
    children
  ): ICashFlowSchemaSection | ICashFlowStatementSection => {
    return R.compose(
      // Accounts node.
      R.when(
        this.isSchemaSectionType(ICashFlowStatementSectionType.ACCOUNTS),
        this.accountsSectionParser
      ),
      // Net income node.
      R.when(
        this.isSchemaSectionType(ICashFlowStatementSectionType.NET_INCOME),
        this.netIncomeSectionMapper
      ),
      // Cash at beginning node.
      R.when(
        this.isSchemaSectionType(
          ICashFlowStatementSectionType.CASH_AT_BEGINNING
        ),
        this.cashAtBeginningSectionParser
      ),
      // Aggregate node. (that has no section type).
      R.when(
        this.isSchemaSectionType(ICashFlowStatementSectionType.AGGREGATE),
        this.regularSectionParser(children)
      )
    )(schemaNode);
  };

  /**
   * Parses the schema section.
   * @param   {ICashFlowSchemaSection | ICashFlowStatementSection} section
   * @param   {number} key
   * @param   {ICashFlowSchemaSection[]} parentValue
   * @param   {(ICashFlowSchemaSection | ICashFlowStatementSection)[]} accumulatedSections
   * @returns {ICashFlowSchemaSection}
   */
  private schemaSectionTotalParser = (
    section: ICashFlowSchemaSection | ICashFlowStatementSection,
    key: number,
    parentValue: ICashFlowSchemaSection[],
    context,
    accumulatedSections: (ICashFlowSchemaSection | ICashFlowStatementSection)[]
  ): ICashFlowSchemaSection | ICashFlowStatementSection => {
    return R.compose(
      // Total equation section.
      R.when(
        this.isSchemaSectionType(ICashFlowStatementSectionType.TOTAL),
        R.curry(this.totalEquationSectionParser)(accumulatedSections)
      )
    )(section);
  };

  /**
   * Schema sections parser.
   * @param   {ICashFlowSchemaSection[]}schema
   * @returns {ICashFlowStatementSection[]}
   */
  private schemaSectionsParser = (
    schema: ICashFlowSchemaSection[]
  ): ICashFlowStatementSection[] => {
    return this.mapNodesDeepReverse(schema, this.schemaSectionParser);
  };

  /**
   * Writes the `total` property to the aggregate node.
   * @param  {ICashFlowStatementSection} section
   * @return {ICashFlowStatementSection}
   */
  private assocRegularSectionTotal = (section: ICashFlowStatementSection) => {
    const total = this.getAccountsMetaTotal(section.children);
    return R.assoc('total', this.getTotalAmountMeta(total), section);
  };

  /**
   * Parses total schema nodes.
   * @param   {(ICashFlowSchemaSection | ICashFlowStatementSection)[]} sections
   * @returns {(ICashFlowSchemaSection | ICashFlowStatementSection)[]}
   */
  private totalSectionsParser = (
    sections: (ICashFlowSchemaSection | ICashFlowStatementSection)[]
  ): (ICashFlowSchemaSection | ICashFlowStatementSection)[] => {
    return this.reduceNodesDeep(
      sections,
      (acc, value, key, parentValue, context) => {
        set(
          acc,
          context.path,
          this.schemaSectionTotalParser(value, key, parentValue, context, acc)
        );
        return acc;
      },
      []
    );
  };

  // --------------------------------------------
  // REPORT FILTERING
  // --------------------------------------------
  /**
   * Detarmines the given section has children and not empty.
   * @param   {ICashFlowStatementSection} section
   * @returns {boolean}
   */
  private isSectionHasChildren = (
    section: ICashFlowStatementSection
  ): boolean => {
    return !isEmpty(section.children);
  };

  /**
   * Detarmines whether the section has no zero amount.
   * @param   {ICashFlowStatementSection} section
   * @returns {boolean}
   */
  private isSectionNoneZero = (section: ICashFlowStatementSection): boolean => {
    return section.total.amount !== 0;
  };

  /**
   * Detarmines whether the parent accounts sections has children.
   * @param   {ICashFlowStatementSection} section
   * @returns {boolean}
   */
  private isAccountsSectionHasChildren = (
    section: ICashFlowStatementSection[]
  ): boolean => {
    return R.ifElse(
      this.isSchemaSectionType(ICashFlowStatementSectionType.ACCOUNTS),
      this.isSectionHasChildren,
      R.always(true)
    )(section);
  };

  /**
   * Detarmines the account section has no zero otherwise returns true.
   * @param   {ICashFlowStatementSection} section
   * @returns {boolean}
   */
  private isAccountLeafNoneZero = (
    section: ICashFlowStatementSection[]
  ): boolean => {
    return R.ifElse(
      this.isSchemaSectionType(ICashFlowStatementSectionType.ACCOUNT),
      this.isSectionNoneZero,
      R.always(true)
    )(section);
  };

  /**
   * Deep filters the non-zero accounts leafs of the report sections.
   * @param   {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private filterNoneZeroAccountsLeafs = (
    sections: ICashFlowStatementSection[]
  ): ICashFlowStatementSection[] => {
    return this.filterNodesDeep(sections, this.isAccountLeafNoneZero);
  };

  /**
   * Deep filter the non-children sections of the report sections.
   * @param   {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private filterNoneChildrenSections = (
    sections: ICashFlowStatementSection[]
  ): ICashFlowStatementSection[] => {
    return this.filterNodesDeep(sections, this.isAccountsSectionHasChildren);
  };

  /**
   * Filters the report data.
   * @param   {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private filterReportData = (
    sections: ICashFlowStatementSection[]
  ): ICashFlowStatementSection[] => {
    return R.compose(
      this.filterNoneChildrenSections,
      this.filterNoneZeroAccountsLeafs
    )(sections);
  };

  /**
   * Schema parser.
   * @param   {ICashFlowSchemaSection[]} schema
   * @returns {ICashFlowSchemaSection[]}
   */
  private schemaParser = (
    schema: ICashFlowSchemaSection[]
  ): ICashFlowSchemaSection[] => {
    return R.compose(
      R.when(
        R.always(this.query.noneTransactions || this.query.noneZero),
        this.filterReportData
      ),
      this.totalSectionsParser,
      this.schemaSectionsParser
    )(schema);
  };

  /**
   * Retrieve the cashflow statement data.
   * @return {ICashFlowStatementData}
   */
  public reportData = (): ICashFlowStatementData => {
    return this.schemaParser(R.clone(CASH_FLOW_SCHEMA));
  };
}
