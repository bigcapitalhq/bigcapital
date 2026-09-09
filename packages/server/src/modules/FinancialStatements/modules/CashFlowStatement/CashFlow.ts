import { flow, constant } from 'fp-ts/function';
import {
  defaultTo,
  set,
  sumBy,
  isEmpty,
  mapValues,
  get,
  cloneDeep,
} from 'lodash';
import * as mathjs from 'mathjs';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import {
  ICashFlowSchemaSection,
  ICashFlowStatementQuery,
  ICashFlowStatementNetIncomeSection,
  ICashFlowStatementAccountSection,
  ICashFlowStatementAccountMeta,
  ICashFlowSchemaAccountRelation,
  ICashFlowStatementSectionType,
  ICashFlowStatementData,
  ICashFlowSchemaTotalSection,
  ICashFlowStatementTotalSection,
  ICashFlowStatementSection,
  ICashFlowCashBeginningNode,
  ICashFlowStatementAggregateSection,
} from './Cashflow.types';
import { CASH_FLOW_SCHEMA } from './schema';
import { ACCOUNT_ROOT_TYPE } from '@/constants/accounts';
import { CashFlowStatementDatePeriods } from './CashFlowDatePeriods';
import { DISPLAY_COLUMNS_BY } from './constants';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ILedger } from '@/modules/Ledger/types/Ledger.types';
import {
  INumberFormatQuery,
  IFinancialReportMeta,
  DEFAULT_REPORT_META,
} from '../../types/Report.types';
import { transformToMapBy } from '@/utils/transform-to-map-by';
import { accumSum } from '@/utils/accum-sum';
import { ModelObject } from 'objection';
import { CashflowStatementBase } from './CashflowStatementBase';
import { when, ifElse, assoc } from '@/common/fp';

export class CashFlowStatement extends flow(
  CashFlowStatementDatePeriods,
  FinancialSheetStructure,
)(CashflowStatementBase) {
  readonly baseCurrency: string;
  readonly i18n: I18nService;
  readonly sectionsByIds = {};
  readonly cashFlowSchemaMap: Map<string, ICashFlowSchemaSection>;
  readonly cashFlowSchemaSeq: Array<string>;
  readonly accountByTypeMap: Map<string, Account[]>;
  readonly accountsByRootType: Map<string, Account[]>;
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
    accounts: Account[],
    ledger: ILedger,
    cashLedger: ILedger,
    netIncomeLedger: ILedger,
    query: ICashFlowStatementQuery,
    i18n: I18nService,
    meta: IFinancialReportMeta,
  ) {
    super();

    this.baseCurrency = meta.baseCurrency;
    this.i18n = i18n;
    this.ledger = ledger;
    this.cashLedger = cashLedger;
    this.netIncomeLedger = netIncomeLedger;
    this.accountByTypeMap = transformToMapBy(accounts, 'accountType');
    this.accountsByRootType = transformToMapBy(accounts, 'accountRootType');
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.dateFormat = meta.dateFormat || DEFAULT_REPORT_META.dateFormat;
    this.dateRangeSet = [];
    this.comparatorDateType =
      query.displayColumnsType === 'total' ? 'day' : query.displayColumnsBy;

    this.initDateRangeCollection();
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
      ACCOUNT_ROOT_TYPE.INCOME,
    );
    const expenseAccountsIds = this.getAccountsIdsByType(
      ACCOUNT_ROOT_TYPE.EXPENSE,
    );
    // Income closing balance.
    const incomeClosingBalance = accumSum(incomeAccountsIds, (id) =>
      this.netIncomeLedger.whereAccountId(id).getClosingBalance(),
    );
    // Expense closing balance.
    const expenseClosingBalance = accumSum(expenseAccountsIds, (id) =>
      this.netIncomeLedger.whereAccountId(id).getClosingBalance(),
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
    nodeSchema,
  ): ICashFlowStatementNetIncomeSection => {
    const netIncome = this.getAccountsNetIncome();

    const node: ICashFlowStatementNetIncomeSection = {
      id: nodeSchema.id,
      label: this.i18n.t(nodeSchema.label),
      total: this.getAmountMeta(netIncome),
      sectionType: ICashFlowStatementSectionType.NET_INCOME,
    };
    return when(
      constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
      this.assocPeriodsToNetIncomeNode,
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
    account: ModelObject<Account>,
  ): ICashFlowStatementAccountMeta => {
    // Retrieve the closing balance of the given account.
    const getClosingBalance = (id) =>
      this.ledger.whereAccountId(id).getClosingBalance();

    const closingBalance = this.amountAdjustment(
      relation.direction,
      getClosingBalance(account.id),
    );

    const node: ICashFlowStatementAccountMeta = {
      id: account.id,
      code: account.code,
      label: account.name,
      accountType: account.accountType,
      adjustmentType: relation.direction,
      total: this.getAmountMeta(closingBalance),
      sectionType: ICashFlowStatementSectionType.ACCOUNT,
    };
    return when(
      constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
      this.assocPeriodsToAccountNode,
    )(node);
  };

  /**
   * Retrieve accounts sections by the given schema relation.
   * @param   {ICashFlowSchemaAccountRelation} relation
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getAccountsBySchemaRelation = (
    relation: ICashFlowSchemaAccountRelation,
  ): ICashFlowStatementAccountMeta[] => {
    const accounts = defaultTo(this.accountByTypeMap.get(relation.type), []);
    return accounts.map((account) => this.accountMetaMapper(relation, account));
  };

  /**
   * Retrieve the accounts meta.
   * @param   {ICashFlowSchemaAccountRelation[]} relations
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getAccountsBySchemaRelations = (
    relations: ICashFlowSchemaAccountRelation[],
  ): ICashFlowStatementAccountMeta[] => {
    return relations.flatMap((relation) =>
      this.getAccountsBySchemaRelation(relation),
    );
  };

  /**
   * Calculates the accounts total
   * @param   {ICashFlowStatementAccountMeta[]} accounts
   * @returns {number}
   */
  private getAccountsMetaTotal = (
    accounts: ICashFlowStatementAccountMeta[],
  ): number => {
    return sumBy(accounts, 'total.amount');
  };

  /**
   * Retrieve the accounts section from the section schema.
   * @param   {ICashFlowSchemaSectionAccounts} sectionSchema
   * @returns {ICashFlowStatementAccountSection}
   */
  private accountsSectionParser = (
    sectionSchema,
  ): ICashFlowStatementAccountSection => {
    const { accountsRelations } = sectionSchema;

    const accounts = this.getAccountsBySchemaRelations(accountsRelations);
    const accountsTotal = this.getAccountsMetaTotal(accounts);
    const total = this.getTotalAmountMeta(accountsTotal);

    const node = {
      sectionType: ICashFlowStatementSectionType.ACCOUNTS,
      id: sectionSchema.id,
      label: this.i18n.t(sectionSchema.label),
      footerLabel: sectionSchema.footerLabel,
      children: accounts,
      total,
    };
    return when(
      constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
      this.assocPeriodsToAggregateNode,
    )(node);
  };

  /**
   * Detarmines the schema section type.
   * @param   {string} type
   * @param   {ICashFlowSchemaSection} section
   * @returns {boolean}
   */
  private isSchemaSectionType =
    (type: string) =>
    (section): boolean => {
      return type === section.sectionType;
    };

  // --------------------------------------------
  // # AGGREGATE NODE
  // --------------------------------------------
  /**
   * Aggregate schema node parser to aggregate report node.
   * @param   {ICashFlowSchemaSection} schemaSection
   * @returns {ICashFlowStatementAggregateSection}
   */
  private regularSectionParser =
    (children) =>
    (schemaSection): ICashFlowStatementAggregateSection => {
      const node = {
        id: schemaSection.id,
        label: this.i18n.t(schemaSection.label),
        footerLabel: this.i18n.t(schemaSection.footerLabel),
        sectionType: ICashFlowStatementSectionType.AGGREGATE,
        children,
      };
      return when(
        this.isSchemaSectionType(ICashFlowStatementSectionType.AGGREGATE),
        this.assocRegularSectionTotal,
      )(
        when(
          this.isSchemaSectionType(ICashFlowStatementSectionType.AGGREGATE),
          when(
            constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
            this.assocPeriodsToAggregateNode,
          ),
        ),
      )(node);
    };

  private transformSectionsToMap = (
    sections: (ICashFlowSchemaSection | ICashFlowStatementSection)[],
  ) => {
    return this.reduceNodesDeep(
      sections,
      (acc, section) => {
        if (section.id) {
          acc[`${section.id}`] = section;
        }
        return acc;
      },
      {},
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
  public evaluateEquation = (
    equation: string,
    scope: { [key: string | number]: number },
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
    accumulatedSections: (ICashFlowSchemaSection | ICashFlowStatementSection)[],
    sectionSchema: ICashFlowSchemaTotalSection,
  ): ICashFlowStatementTotalSection => {
    const mappedSectionsById = this.transformSectionsToMap(accumulatedSections);
    const nodesTotalById = this.sectionsMapToTotal(mappedSectionsById);

    const total = this.evaluateEquation(sectionSchema.equation, nodesTotalById);

    return when(
      constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
      (node: ICashFlowStatementTotalSection) =>
        this.assocTotalEquationDatePeriods(
          mappedSectionsById,
          sectionSchema.equation,
          node,
        ),
    )({
      sectionType: ICashFlowStatementSectionType.TOTAL,
      id: sectionSchema.id,
      label: this.i18n.t(sectionSchema.label),
      total: this.getTotalAmountMeta(total),
    });
  };

  /**
   * Retrieve the beginning cash from date.
   * @param  {Date|string} fromDate -
   * @return {Date}
   */
  public beginningCashFrom = (fromDate: string | Date): Date => {
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
    account: ModelObject<Account>,
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
    return when(
      constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
      this.assocCashAtBeginningAccountDatePeriods,
    )(node);
  };

  /**
   * Retrieve accounts sections by the given schema relation.
   * @param   {ICashFlowSchemaAccountRelation} relation
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getCashAccountsBySchemaRelation = (
    relation: ICashFlowSchemaAccountRelation,
  ): ICashFlowStatementAccountMeta[] => {
    const accounts = this.accountByTypeMap.get(relation.type) || [];
    return accounts.map((account) =>
      this.cashAccountMetaMapper(relation, account),
    );
  };

  /**
   * Retrieve the accounts meta.
   * @param {ICashFlowSchemaAccountRelation[]} relations
   * @returns {ICashFlowStatementAccountMeta[]}
   */
  private getCashAccountsBySchemaRelations = (
    relations: ICashFlowSchemaAccountRelation[],
  ): ICashFlowStatementAccountMeta[] => {
    return relations
      .map((relation) => this.getCashAccountsBySchemaRelation(relation))
      .flat();
  };

  /**
   * Parses the cash at beginning section.
   * @param  {ICashFlowSchemaSection} sectionSchema -
   * @return {ICashFlowCashBeginningNode}
   */
  private cashAtBeginningSectionParser = (
    nodeSchema,
  ): ICashFlowCashBeginningNode => {
    const { accountsRelations } = nodeSchema;
    const children = this.getCashAccountsBySchemaRelations(accountsRelations);
    const total = this.getAccountsMetaTotal(children);

    const node = {
      sectionType: ICashFlowStatementSectionType.CASH_AT_BEGINNING,
      id: nodeSchema.id,
      label: this.i18n.t(nodeSchema.label),
      children,
      total: this.getTotalAmountMeta(total),
    };
    return when(
      constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
      this.assocCashAtBeginningDatePeriods,
    )(node);
  };

  /**
   * Parses the schema section.
   * @param   {ICashFlowSchemaSection} schemaNode
   * @param   {ICashFlowStatementSection[]} children
   * @returns {ICashFlowSchemaSection | ICashFlowStatementSection}
   */
  private schemaSectionParser = (
    schemaNode: ICashFlowSchemaSection,
    children,
  ): ICashFlowSchemaSection | ICashFlowStatementSection => {
    return flow(
      // Aggregate node. (that has no section type).
      when(
        this.isSchemaSectionType(ICashFlowStatementSectionType.AGGREGATE),
        this.regularSectionParser(children),
      ),
      // Cash at beginning node.
      when(
        this.isSchemaSectionType(
          ICashFlowStatementSectionType.CASH_AT_BEGINNING,
        ),
        this.cashAtBeginningSectionParser,
      ),
      // Net income node.
      when(
        this.isSchemaSectionType(ICashFlowStatementSectionType.NET_INCOME),
        this.netIncomeSectionMapper,
      ),
      // Accounts node.
      when(
        this.isSchemaSectionType(ICashFlowStatementSectionType.ACCOUNTS),
        this.accountsSectionParser,
      ),
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
    parentValue: (ICashFlowSchemaSection | ICashFlowStatementSection)[],
    context,
    accumulatedSections: (ICashFlowSchemaSection | ICashFlowStatementSection)[],
  ): ICashFlowSchemaSection | ICashFlowStatementSection => {
    return when(
      this.isSchemaSectionType(ICashFlowStatementSectionType.TOTAL),
      () =>
        this.totalEquationSectionParser(
          accumulatedSections,
          section as ICashFlowSchemaTotalSection,
        ),
    )(section);
  };

  /**
   * Schema sections parser.
   * @param   {ICashFlowSchemaSection[]}schema
   * @returns {ICashFlowStatementSection[]}
   */
  private schemaSectionsParser = (
    schema: ICashFlowSchemaSection[],
  ): ICashFlowStatementSection[] => {
    return this.mapNodesDeepReverse(schema, this.schemaSectionParser);
  };

  /**
   * Writes the `total` property to the aggregate node.
   * @param  {ICashFlowStatementSection} section
   * @return {ICashFlowStatementSection}
   */
  private assocRegularSectionTotal = (section) => {
    const total = this.getAccountsMetaTotal(section.children);
    return assoc('total', this.getTotalAmountMeta(total), section);
  };

  /**
   * Parses total schema nodes.
   * @param   {(ICashFlowSchemaSection | ICashFlowStatementSection)[]} sections
   * @returns {(ICashFlowSchemaSection | ICashFlowStatementSection)[]}
   */
  private totalSectionsParser = (
    sections: (ICashFlowSchemaSection | ICashFlowStatementSection)[],
  ): (ICashFlowSchemaSection | ICashFlowStatementSection)[] => {
    return this.reduceNodesDeep(
      sections,
      (acc, value, key, parentValue, context) => {
        set(
          acc,
          context.path,
          this.schemaSectionTotalParser(value, key, parentValue, context, acc),
        );
        return acc;
      },
      [],
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
  private isSectionHasChildren = (section): boolean => {
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
    section: ICashFlowStatementSection,
  ): boolean => {
    return ifElse(
      this.isSchemaSectionType(ICashFlowStatementSectionType.ACCOUNTS),
      this.isSectionHasChildren,
      constant(true),
    )(section);
  };

  /**
   * Detarmines the account section has no zero otherwise returns true.
   * @param   {ICashFlowStatementSection} section
   * @returns {boolean}
   */
  private isAccountLeafNoneZero = (
    section: ICashFlowStatementSection,
  ): boolean => {
    return ifElse(
      this.isSchemaSectionType(ICashFlowStatementSectionType.ACCOUNT),
      this.isSectionNoneZero,
      constant(true),
    )(section);
  };

  /**
   * Deep filters the non-zero accounts leafs of the report sections.
   * @param   {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private filterNoneZeroAccountsLeafs = (
    sections: ICashFlowStatementSection[],
  ): ICashFlowStatementSection[] => {
    return this.filterNodesDeep(sections, this.isAccountLeafNoneZero);
  };

  /**
   * Deep filter the non-children sections of the report sections.
   * @param   {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private filterNoneChildrenSections = (
    sections: ICashFlowStatementSection[],
  ): ICashFlowStatementSection[] => {
    return this.filterNodesDeep(sections, this.isAccountsSectionHasChildren);
  };

  /**
   * Filters the report data.
   * @param   {ICashFlowStatementSection[]} sections
   * @returns {ICashFlowStatementSection[]}
   */
  private filterReportData = (sections): ICashFlowStatementSection[] => {
    return flow(
      this.filterNoneZeroAccountsLeafs,
      this.filterNoneChildrenSections,
    )(sections);
  };

  /**
   * Schema parser.
   * @param   {ICashFlowSchemaSection[]} schema
   * @returns {ICashFlowSchemaSection[]}
   */
  private schemaParser = (
    schema: ICashFlowSchemaSection[],
  ): ICashFlowStatementSection[] => {
    return flow(
      this.schemaSectionsParser,
      this.totalSectionsParser,
      when(
        constant(this.query.noneTransactions || this.query.noneZero),
        this.filterReportData,
      ),
    )(schema);
  };

  /**
   * Retrieve the cashflow statement data.
   * @return {ICashFlowStatementData}
   */
  public reportData = (): ICashFlowStatementData => {
    return this.schemaParser(
      cloneDeep(CASH_FLOW_SCHEMA),
    ) as ICashFlowStatementData;
  };
}
