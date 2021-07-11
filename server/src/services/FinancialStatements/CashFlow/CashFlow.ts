import * as R from 'ramda';
import { defaultTo, map, set, sumBy, isEmpty, mapValues, get } from 'lodash';
import * as mathjs from 'mathjs';
import moment from 'moment';
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
  ICashFlowDatePeriod,
  ICashFlowStatement,
  ICashFlowSchemaTotalSection,
  ICashFlowStatementTotalSection,
  ICashFlowStatementSection,
} from 'interfaces';
import CASH_FLOW_SCHEMA from './schema';
import FinancialSheet from '../FinancialSheet';
import {
  transformToMapBy,
  accumSum,
  dateRangeFromToCollection,
  applyMixins,
} from 'utils';
import {
  reduceDeep,
  iteratee,
  mapValuesDeep,
  filterDeep,
} from 'utils/deepdash';
import { ACCOUNT_ROOT_TYPE } from 'data/AccountTypes';
import CashFlowDatePeriods from './CashFlowDatePeriods';
import I18nService from 'services/I18n/I18nService';

const MAP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };

const DISPLAY_COLUMNS_BY = {
  DATE_PERIODS: 'date_periods',
  TOTAL: 'total',
};

class CashFlowStatement extends FinancialSheet implements ICashFlowStatement {
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
  readonly schemaSectionParserIteratee: any;
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
    this.schemaSectionParserIteratee = iteratee(this.schemaSectionParser);
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.dateRangeSet = [];

    this.comparatorDateType = query.displayColumnsType === 'total'
      ? 'day' : query.displayColumnsBy;

    this.initDateRangeCollection();
  }

  // --------------------------------------------
  // # GENERAL UTILITIES
  // --------------------------------------------
  /**
   * Retrieve the expense accounts ids.
   * @return {number[]}
   */
  private getAccountsIdsByType(accountType: string): number[] {
    const expenseAccounts = this.accountsByRootType.get(accountType);
    const expenseAccountsIds = map(expenseAccounts, 'id');

    return expenseAccountsIds;
  }

  /**
   * Detarmines the given display columns by type.
   * @param {string} displayColumnsBy
   * @returns {boolean}
   */
  private isDisplayColumnsBy(displayColumnsBy: string): boolean {
    return this.query.displayColumnsType === displayColumnsBy;
  }

  /**
   * Adjustments the given amount.
   * @param {string} direction
   * @param {number} amount -
   * @return {number}
   */
  private amountAdjustment(direction: 'mines' | 'plus', amount): number {
    return R.when(
      R.always(R.equals(direction, 'mines')),
      R.multiply(-1)
    )(amount);
  }

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
   * @param {ICashFlowSchemaSection} sectionSchema - Report section schema.
   * @returns {ICashFlowStatementNetIncomeSection}
   */
  private netIncomeSectionMapper(
    sectionSchema: ICashFlowSchemaSection
  ): ICashFlowStatementNetIncomeSection {
    const netIncome = this.getAccountsNetIncome();

    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocPeriodsToNetIncomeNode.bind(this)
      )
    )({
      id: sectionSchema.id,
      label: this.i18n.__(sectionSchema.label),
      total: this.getAmountMeta(netIncome),
      sectionType: ICashFlowStatementSectionType.NET_INCOME,
    });
  }

  // --------------------------------------------
  // # ACCOUNT NODE
  // --------------------------------------------

  /**
   * Retrieve account meta.
   * @param {ICashFlowSchemaAccountRelation} relation - Account relation.
   * @param {IAccount} account -
   * @returns {ICashFlowStatementAccountMeta}
   */
  private accountMetaMapper(
    relation: ICashFlowSchemaAccountRelation,
    account: IAccount
  ): ICashFlowStatementAccountMeta {
    // Retrieve the closing balance of the given account.
    const getClosingBalance = (id) =>
      this.ledger.whereAccountId(id).getClosingBalance();

    const closingBalance = R.compose(
      // Multiplies the amount by -1 in case the relation in mines.
      R.curry(this.amountAdjustment)(relation.direction)
    )(getClosingBalance(account.id));

    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocPeriodsToAccountNode.bind(this)
      )
    )({
      id: account.id,
      code: account.code,
      label: account.name,
      accountType: account.accountType,
      adjusmentType: relation.direction,
      total: this.getAmountMeta(closingBalance),
      sectionType: ICashFlowStatementSectionType.ACCOUNT,
    });
  }

  /**
   * Retrieve accounts sections by the given schema relation.
   * @param {ICashFlowSchemaAccountRelation} relation
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getAccountsBySchemaRelation(
    relation: ICashFlowSchemaAccountRelation
  ): ICashFlowStatementAccountMeta[] {
    const accounts = defaultTo(this.accountByTypeMap.get(relation.type), []);
    const accountMetaMapper = R.curry(this.accountMetaMapper.bind(this))(
      relation
    );
    return R.map(accountMetaMapper)(accounts);
  }

  /**
   * Retrieve the accounts meta.
   * @param {string[]} types
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getAccountsBySchemaRelations(
    relations: ICashFlowSchemaAccountRelation[]
  ): ICashFlowStatementAccountMeta[] {
    return R.pipe(
      R.append(R.map(this.getAccountsBySchemaRelation.bind(this))(relations)),
      R.flatten
    )([]);
  }

  /**
   * Calculates the accounts total
   * @param {ICashFlowStatementAccountMeta[]} accounts
   * @returns {number}
   */
  private getAccountsMetaTotal(
    accounts: ICashFlowStatementAccountMeta[]
  ): number {
    return sumBy(accounts, 'total.amount');
  }

  /**
   * Retrieve the accounts section from the section schema.
   * @param {ICashFlowSchemaSectionAccounts} sectionSchema
   * @returns {ICashFlowStatementAccountSection}
   */
  private accountsSectionParser(
    sectionSchema: ICashFlowSchemaSectionAccounts
  ): ICashFlowStatementAccountSection {
    const { accountsRelations } = sectionSchema;

    const accounts = this.getAccountsBySchemaRelations(accountsRelations);
    const total = this.getAccountsMetaTotal(accounts);

    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocPeriodsToAggregateNode.bind(this)
      )
    )({
      sectionType: ICashFlowStatementSectionType.ACCOUNTS,
      id: sectionSchema.id,
      label: this.i18n.__(sectionSchema.label),
      footerLabel: this.i18n.__(sectionSchema.footerLabel),
      children: accounts,
      total: this.getTotalAmountMeta(total),
    });
  }

  /**
   * Detarmines the schema section type.
   * @param {string} type
   * @param {ICashFlowSchemaSection} section
   * @returns {boolean}
   */
  private isSchemaSectionType(
    type: string,
    section: ICashFlowSchemaSection
  ): boolean {
    return type === section.sectionType;
  }

  // --------------------------------------------
  // # AGGREGATE NODE
  // --------------------------------------------

  /**
   *
   * @param {ICashFlowSchemaSection} schemaSection
   * @returns
   */
  private regularSectionParser(
    schemaSection: ICashFlowSchemaSection
  ): ICashFlowStatementSection {
    return {
      id: schemaSection.id,
      label: this.i18n.__(schemaSection.label),
      footerLabel: this.i18n.__(schemaSection.footerLabel),
      sectionType: ICashFlowStatementSectionType.REGULAR,
    };
  }

  private transformSectionsToMap(sections: ICashFlowSchemaSection[]) {
    return reduceDeep(
      sections,
      (acc, section) => {
        if (section.id) {
          acc[`${section.id}`] = section;
        }
        return acc;
      },
      {},
      MAP_CONFIG
    );
  }

  // --------------------------------------------
  // # TOTAL EQUATION NODE
  // --------------------------------------------

  private sectionsMapToTotal(mappedSections: { [key: number]: any }) {
    return mapValues(mappedSections, (node) => get(node, 'total.amount') || 0);
  }

  /**
   * Evauluate equaation string with the given scope table.
   * @param {string} equation -
   * @param {{ [key: string]: number }} scope -
   * @return {number}
   */
  private evaluateEquation(
    equation: string,
    scope: { [key: string | number]: number }
  ): number {
    return mathjs.evaluate(equation, scope);
  }

  /**
   * Retrieve the total section from the eqauation parser.
   * @param {ICashFlowSchemaTotalSection} sectionSchema
   * @param {ICashFlowSchemaSection[]} accumlatedSections
   */
  private totalEquationSectionParser(
    accumlatedSections: ICashFlowSchemaSection[],
    sectionSchema: ICashFlowSchemaTotalSection
  ): ICashFlowStatementTotalSection {
    const mappedSectionsById = this.transformSectionsToMap(accumlatedSections);
    const nodesTotalById = this.sectionsMapToTotal(mappedSectionsById);

    const total = this.evaluateEquation(sectionSchema.equation, nodesTotalById);

    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        R.curry(this.assocTotalEquationDatePeriods.bind(this))(
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
  }

  /**
   * Retrieve the beginning cash from date.
   * @param {Date|string} fromDate -
   * @return {Date}
   */
  private beginningCashFrom(fromDate: string | Date): Date {
    return moment(fromDate).subtract(1, 'days').toDate();
  }

  /**
   * Retrieve account meta.
   * @param {ICashFlowSchemaAccountRelation} relation
   * @param {IAccount} account
   * @returns {ICashFlowStatementAccountMeta}
   */
  private cashAccountMetaMapper(
    relation: ICashFlowSchemaAccountRelation,
    account: IAccount
  ): ICashFlowStatementAccountMeta {
    const cashToDate = this.beginningCashFrom(this.query.fromDate);

    const closingBalance = this.cashLedger
      .whereToDate(cashToDate)
      .whereAccountId(account.id)
      .getClosingBalance();

    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocCashAtBeginningAccountDatePeriods.bind(this)
      )
    )({
      id: account.id,
      code: account.code,
      label: account.name,
      accountType: account.accountType,
      adjusmentType: relation.direction,
      total: this.getAmountMeta(closingBalance),
      sectionType: ICashFlowStatementSectionType.ACCOUNT,
    });
  }

  /**
   * Retrieve accounts sections by the given schema relation.
   * @param {ICashFlowSchemaAccountRelation} relation
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getCashAccountsBySchemaRelation(
    relation: ICashFlowSchemaAccountRelation
  ): ICashFlowStatementAccountMeta[] {
    const accounts = this.accountByTypeMap.get(relation.type) || [];
    const accountMetaMapper = R.curry(this.cashAccountMetaMapper.bind(this))(
      relation
    );
    return accounts.map(accountMetaMapper);
  }

  /**
   * Retrieve the accounts meta.
   * @param {string[]} types
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getCashAccountsBySchemaRelations(
    relations: ICashFlowSchemaAccountRelation[]
  ): ICashFlowStatementAccountMeta[] {
    return R.concat(
      ...R.map(this.getCashAccountsBySchemaRelation.bind(this))(relations)
    );
  }

  /**
   * Parses the cash at beginning section.
   * @param {ICashFlowSchemaTotalSection} sectionSchema -
   * @return {}
   */
  private cashAtBeginningSectionParser(sectionSchema) {
    const { accountsRelations } = sectionSchema;

    const children = this.getCashAccountsBySchemaRelations(accountsRelations);
    const total = this.getAccountsMetaTotal(children);

    return R.compose(
      R.when(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        this.assocCashAtBeginningDatePeriods.bind(this)
      )
    )({
      sectionType: ICashFlowStatementSectionType.CASH_AT_BEGINNING,
      id: sectionSchema.id,
      label: this.i18n.__(sectionSchema.label),
      children,
      total: this.getTotalAmountMeta(total),
    });
  }

  /**
   * Parses the schema section.
   * @param {ICashFlowSchemaSection} section
   * @returns {ICashFlowSchemaSection}
   */
  private schemaSectionParser(
    section: ICashFlowSchemaSection,
    key: number,
    parentValue: ICashFlowSchemaSection[],
    context,
    accumlatedSections: ICashFlowSchemaSection[]
  ): ICashFlowSchemaSection {
    const isSchemaSectionType = R.curry(this.isSchemaSectionType);

    return R.compose(
      // Accounts node.
      R.when(
        isSchemaSectionType(ICashFlowStatementSectionType.ACCOUNTS),
        this.accountsSectionParser.bind(this)
      ),
      // Net income node.
      R.when(
        isSchemaSectionType(ICashFlowStatementSectionType.NET_INCOME),
        this.netIncomeSectionMapper.bind(this)
      ),
      // Cash at beginning node.
      R.when(
        isSchemaSectionType(ICashFlowStatementSectionType.CASH_AT_BEGINNING),
        R.curry(this.cashAtBeginningSectionParser.bind(this))
      ),
      // Aggregate node. (that has no section type).
      R.when(
        isSchemaSectionType(ICashFlowStatementSectionType.AGGREGATE),
        this.regularSectionParser.bind(this)
      )
    )(section);
  }

  /**
   * Parses the schema section.
   * @param {ICashFlowSchemaSection} section
   * @returns {ICashFlowSchemaSection}
   */
  private schemaSectionTotalParser(
    section: ICashFlowSchemaSection | ICashFlowStatementSection,
    key: number,
    parentValue: ICashFlowSchemaSection[],
    context,
    accumlatedSections: ICashFlowSchemaSection | ICashFlowStatementSection[]
  ): ICashFlowSchemaSection {
    const isSchemaSectionType = R.curry(this.isSchemaSectionType);

    return R.compose(
      // Total equation section.
      R.when(
        isSchemaSectionType(ICashFlowStatementSectionType.TOTAL),
        R.curry(this.totalEquationSectionParser.bind(this))(accumlatedSections)
      )
    )(section);
  }

  /**
   *
   * @param acc
   * @param value
   * @param key
   * @param parentValue
   * @param context
   * @returns
   */
  private schemaSectionsReducer(acc, value, key, parentValue, context) {
    set(
      acc,
      context.path,
      this.schemaSectionParserIteratee(value, key, parentValue, context, acc)
    );
    return acc;
  }

  /**
   * Schema sections parser.
   * @param {ICashFlowSchemaSection[]}schema
   * @returns
   */
  private schemaSectionsParser(schema: ICashFlowSchemaSection[]) {
    return reduceDeep(
      schema,
      this.schemaSectionsReducer.bind(this),
      [],
      MAP_CONFIG
    );
  }

  /**
   * Writes the `total` property to the aggregate node.
   * @return {ICashFlowStatementSection}
   */
  private assocRegularSectionTotal(section: ICashFlowStatementSection) {
    const total = this.getAccountsMetaTotal(section.children);
    return R.assoc('total', this.getTotalAmountMeta(total), section);
  }

  /**
   * Parses the given node on stage 2.
   * @param {ICashFlowStatementSection} node
   * @return {ICashFlowStatementSection}
   */
  private sectionMapperAfterParsing(section: ICashFlowStatementSection) {
    const isSchemaSectionType = R.curry(this.isSchemaSectionType);

    return R.compose(
      R.when(
        isSchemaSectionType(ICashFlowStatementSectionType.REGULAR),
        this.assocRegularSectionTotal.bind(this)
      ),
      R.when(
        isSchemaSectionType(ICashFlowStatementSectionType.REGULAR),
        R.when(
          R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
          this.assocPeriodsToAggregateNode.bind(this)
        )
      )
    )(section);
  }

  private regularSectionsTotal(
    sections: ICashFlowSchemaSection[]
  ): ICashFlowSchemaSection[] {
    return mapValuesDeep(
      sections,
      this.sectionMapperAfterParsing.bind(this),
      MAP_CONFIG
    );
  }

  private totalSectionsParser(
    sections: ICashFlowSchemaSection | ICashFlowStatementSection[]
  ) {
    return reduceDeep(
      sections,
      (acc, value, key, parentValue, context) => {
        set(
          acc,
          context.path,
          this.schemaSectionTotalParser(value, key, parentValue, context, acc)
        );
        return acc;
      },
      [],
      MAP_CONFIG
    );
  }

  // --------------------------------------------
  // REPORT FILTERING
  // --------------------------------------------

  /**
   * Detarmines the given section has children and not empty.
   * @param {ICashFlowStatementSection} section
   * @returns {boolean}
   */
  private isSectionHasChildren(section: ICashFlowStatementSection): boolean {
    return !isEmpty(section.children);
  }

  /**
   * Detarmines whether the section has no zero amount.
   * @param {ICashFlowStatementSection} section
   * @returns {boolean}
   */
  private isSectionNoneZero(section: ICashFlowStatementSection): boolean {
    return section.total.amount !== 0;
  }

  /**
   * Detarmines whether the parent accounts sections has children.
   * @param {ICashFlowStatementSection} section
   * @returns {boolean}
   */
  private isAccountsSectionHasChildren(
    section: ICashFlowStatementSection[]
  ): boolean {
    const isSchemaSectionType = R.curry(this.isSchemaSectionType);

    return R.ifElse(
      isSchemaSectionType(ICashFlowStatementSectionType.ACCOUNTS),
      this.isSectionHasChildren.bind(this),
      R.always(true)
    )(section);
  }

  /**
   * Detarmines the account section has no zero otherwise returns true.
   * @param {ICashFlowStatementSection} section
   * @returns {boolean}
   */
  private isAccountLeafNoneZero(section: ICashFlowStatementSection[]): boolean {
    const isSchemaSectionType = R.curry(this.isSchemaSectionType);

    return R.ifElse(
      isSchemaSectionType(ICashFlowStatementSectionType.ACCOUNT),
      this.isSectionNoneZero.bind(this),
      R.always(true)
    )(section);
  }

  /**
   * Deep filters the non-zero accounts leafs of the report sections.
   * @param {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private filterNoneZeroAccountsLeafs(sections: ICashFlowStatementSection[]) {
    return filterDeep(
      sections,
      this.isAccountLeafNoneZero.bind(this),
      MAP_CONFIG
    ) || [];
  }

  /**
   * Deep filter the non-children sections of the report sections.
   * @param {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private filterNoneChildrenSections(sections: ICashFlowStatementSection[]) {
    return filterDeep(
      sections,
      this.isAccountsSectionHasChildren.bind(this),
      MAP_CONFIG
    ) || [];
  }

  /**
   * Filters the report data.
   * @param {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private filterReportData(sections: ICashFlowStatementSection[]) {
    return R.compose(
      this.filterNoneChildrenSections.bind(this),
      this.filterNoneZeroAccountsLeafs.bind(this)
    )(sections);
  }

  /**
   * Schema parser.
   * @param {ICashFlowSchemaSection[]} schema
   * @returns {ICashFlowSchemaSection[]}
   */
  private schemaParser(
    schema: ICashFlowSchemaSection[]
  ): ICashFlowSchemaSection[] {
    return R.compose(
      R.when(
        R.always(!this.query.noneTransactions && !this.query.noneZero),
        this.filterReportData.bind(this)
      ),
      this.totalSectionsParser.bind(this),
      this.regularSectionsTotal.bind(this),
      this.schemaSectionsParser.bind(this)
    )(schema);
  }

  /**
   * Retrieve the cashflow statement data.
   * @return {ICashFlowStatementData}
   */
  public reportData(): ICashFlowStatementData {
    return this.schemaParser(R.clone(CASH_FLOW_SCHEMA));
  }
}

applyMixins(CashFlowStatement, [CashFlowDatePeriods]);

export default CashFlowStatement;
