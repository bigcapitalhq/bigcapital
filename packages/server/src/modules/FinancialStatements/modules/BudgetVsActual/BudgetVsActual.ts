import * as R from 'ramda';
import { ModelObject } from 'objection';
import { I18nService } from 'nestjs-i18n';
import {
  IBudgetVsActualQuery,
  IBudgetVsActualNode,
  IBudgetVsActualAccountNode,
  IBudgetVsActualAggregateNode,
  IBudgetVsActualEquationNode,
} from './BudgetVsActual.types';
import { BUDGET_VS_ACTUAL_NODE_TYPE } from './constants';
import { BudgetVsActualSchema } from './BudgetVsActualSchema';
import { BudgetVsActualDatePeriods } from './BudgetVsActualDatePeriods';
import { BudgetVsActualBase } from './BudgetVsActualBase';
import { BudgetVsActualQuery } from './BudgetVsActualQuery';
import { BudgetVsActualRepository } from './BudgetVsActualRepository';
import { FinancialDateRanges } from '../../common/FinancialDateRanges';
import { FinancialEvaluateEquation } from '../../common/FinancialEvaluateEquation';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialSheet } from '../../common/FinancialSheet';
import { Account } from '@/modules/Accounts/models/Account.model';
import { flatToNestedArray } from '@/utils/flat-to-nested-array';
import { IFinancialReportMeta, DEFAULT_REPORT_META } from '../../types/Report.types';
import { INumberFormatQuery } from '../../types/Report.types';

interface IBudgetVsActualContext {
  repository: BudgetVsActualRepository;
  query: BudgetVsActualQuery;
}

export class BudgetVsActualSheet extends R.pipe(
  BudgetVsActualDatePeriods,
  BudgetVsActualSchema,
  BudgetVsActualBase,
  FinancialDateRanges,
  FinancialEvaluateEquation,
  FinancialSheetStructure,
)(FinancialSheet) {
  readonly query: BudgetVsActualQuery;
  readonly baseCurrency: string;
  readonly repository: BudgetVsActualRepository;
  readonly i18n: I18nService;
  readonly numberFormat: INumberFormatQuery;
  readonly dateFormat: string;

  constructor(
    repository: BudgetVsActualRepository,
    query: IBudgetVsActualQuery,
    i18n: I18nService,
    meta: IFinancialReportMeta,
  ) {
    super();

    this.query = new BudgetVsActualQuery(query);
    this.repository = repository;
    this.baseCurrency = meta.baseCurrency;
    this.numberFormat = this.query.query.numberFormat;
    this.dateFormat = meta.dateFormat || DEFAULT_REPORT_META.dateFormat;
    this.i18n = i18n;
  }

  private get ctx(): IBudgetVsActualContext {
    return this as unknown as IBudgetVsActualContext;
  }

  private accountNodeMapper = (
    account: ModelObject<Account>,
  ): IBudgetVsActualAccountNode => {
    const childrenAccountIds: number[] = this.repository.accountsGraph.dependenciesOf(
      account.id,
    );
    const accountIds = R.uniq(R.append(account.id, childrenAccountIds));

    const actual = this.repository.getActualClosingBalance(accountIds);
    const budget = this.repository.getBudgetAmountForAccounts(accountIds);
    const variance = this.getVariance(actual, budget);
    const variancePct = this.getVariancePercentage(actual, budget);

    return {
      id: account.id,
      name: account.name,
      code: account.code,
      nodeType: BUDGET_VS_ACTUAL_NODE_TYPE.ACCOUNT,
      budget: this.getAmountMeta(budget),
      actual: this.getAmountMeta(actual),
      variance: this.getAmountMeta(variance),
      variancePercentage: this.getPercentageAmountMeta(variancePct),
    };
  };

  private accountNodeCompose = (account: ModelObject<Account>): IBudgetVsActualAccountNode => {
    let result: any = this.accountNodeMapper(account);
    if (this.query.isDatePeriodsColumnsType()) {
      result = this.assocAccountNodeDatePeriods(result);
    }
    return result as IBudgetVsActualAccountNode;
  };

  private getAccountsNodesByTypes = (types: string[]): IBudgetVsActualAccountNode[] => {
    const accounts = this.repository.getAccountsByType(types);
    const accountsTree = flatToNestedArray(accounts, {
      id: 'id',
      parentId: 'parentAccountId',
    });
    return this.mapNodesDeep(accountsTree, this.accountNodeCompose);
  };

  private accountsSchemaNodeMapper = (node: any): IBudgetVsActualAggregateNode => {
    const accountsTypes: string[] = node.accountsTypes || node.accountTypes;
    const children: IBudgetVsActualNode[] = accountsTypes
      ? this.getAccountsNodesByTypes(accountsTypes)
      : [];
    const schemaChildren: IBudgetVsActualNode[] = node.children
      ? this.parseSchemaChildren(node.children)
      : [];

    const allChildren = [...children, ...schemaChildren];

    const budgetTotal = this.getBudgetOfNodes(allChildren);
    const actualTotal = this.getActualOfNodes(allChildren);
    const variance = this.getVariance(actualTotal, budgetTotal);
    const variancePct = this.getVariancePercentage(actualTotal, budgetTotal);

    const nodeType = node.type === 'AGGREGATE'
      ? BUDGET_VS_ACTUAL_NODE_TYPE.AGGREGATE
      : BUDGET_VS_ACTUAL_NODE_TYPE.ACCOUNTS;

    return {
      id: node.id,
      name: this.i18n.t(node.name),
      nodeType: nodeType as 'ACCOUNTS' | 'AGGREGATE',
      budget: this.getTotalAmountMeta(budgetTotal),
      actual: this.getTotalAmountMeta(actualTotal),
      variance: this.getTotalAmountMeta(variance),
      variancePercentage: this.getPercentageTotalAmountMeta(variancePct),
      children: allChildren,
    };
  };

  private accountsSchemaNodeCompose = (node: any): IBudgetVsActualAggregateNode => {
    let result: any = this.accountsSchemaNodeMapper(node);
    if (this.query.isDatePeriodsColumnsType()) {
      result = this.assocAggregateDatePeriod(result);
    }
    return result as IBudgetVsActualAggregateNode;
  };

  private equationSchemaNodeParser = R.curry(
    (accNodes: any[], node: any): IBudgetVsActualEquationNode => {
      const equation: string = node.equation;

      const budgetTable = this.getNodesTableForEvaluating(
        'budget.amount',
        accNodes,
      ) as Record<string, number>;
      const budgetTotal = this.evaluateEquation(equation, budgetTable);

      const actualTable = this.getNodesTableForEvaluating(
        'actual.amount',
        accNodes,
      ) as Record<string, number>;
      const actualTotal = this.evaluateEquation(equation, actualTable);

      const variance = this.getVariance(actualTotal, budgetTotal);
      const variancePct = this.getVariancePercentage(actualTotal, budgetTotal);

      return {
        id: node.id,
        name: this.i18n.t(node.name),
        nodeType: BUDGET_VS_ACTUAL_NODE_TYPE.EQUATION,
        budget: this.getTotalAmountMeta(budgetTotal),
        actual: this.getTotalAmountMeta(actualTotal),
        variance: this.getTotalAmountMeta(variance),
        variancePercentage: this.getPercentageTotalAmountMeta(variancePct),
      };
    },
  );

  private equationSchemaNodeCompose = R.curry(
    (accNodes: any[], node: any): IBudgetVsActualEquationNode => {
      let result: any = node;
      if (this.isEquationNode(node)) {
        result = this.equationSchemaNodeParser(accNodes)(node);
      }
      if (this.isEquationNode(result) && this.query.isDatePeriodsColumnsType()) {
        result = this.assocEquationNodeDatePeriod(accNodes, (node as any).equation, result);
      }
      return result as IBudgetVsActualEquationNode;
    },
  );

  private parseSchemaChildren = (
    children: any[],
  ): IBudgetVsActualNode[] => {
    return this.mapNodesDeep(children, this.schemaNodeMapper);
  };

  private schemaNodeMapper = (node: any): IBudgetVsActualNode => {
    let result: any = node;
    if (this.isAccountsNode(node)) {
      result = this.accountsSchemaNodeCompose(node);
    }
    return result as IBudgetVsActualNode;
  };

  private reportSchemaAccountsNodesCompose = (
    schemaNodes: any[],
  ): IBudgetVsActualNode[] => {
    return this.mapNodesDeep(schemaNodes, (node: any) => {
      let result: any = node;
      if (this.isAccountsNode(node)) {
        result = this.accountsSchemaNodeCompose(node);
      }
      return result;
    });
  };

  private reportSchemaEquationNodesCompose = (
    nodes: any[],
  ): IBudgetVsActualNode[] => {
    return this.mapAccNodesDeep(
      nodes,
      (node: any, key: number, parentValue: any, accNodes: any[], context: any) => {
        let result: any = node;
        if (this.isEquationNode(node)) {
          result = this.equationSchemaNodeCompose(accNodes, node);
        }
        return result;
      },
    );
  };

  private reportFilterPlugin = (nodes: IBudgetVsActualNode[]): IBudgetVsActualNode[] => {
    if (!this.query.query.noneZero && !this.query.query.noneTransactions) {
      return nodes;
    }
    return this.filterNodesDeep(nodes, (node: IBudgetVsActualNode) => {
      if (node.nodeType === BUDGET_VS_ACTUAL_NODE_TYPE.ACCOUNT) {
        const accountNode = node as IBudgetVsActualAccountNode;
        if (this.query.query.noneZero) {
          return (
            accountNode.budget.amount !== 0 ||
            accountNode.actual.amount !== 0
          );
        }
        if (this.query.query.noneTransactions) {
          return accountNode.actual.amount !== 0;
        }
      }
      return true;
    });
  };

  public reportData = (): IBudgetVsActualNode[] => {
    const schema = this.getSchema();

    return R.compose(
      this.reportFilterPlugin,
      this.reportSchemaEquationNodesCompose,
      this.reportSchemaAccountsNodesCompose,
    )(schema);
  };
}
