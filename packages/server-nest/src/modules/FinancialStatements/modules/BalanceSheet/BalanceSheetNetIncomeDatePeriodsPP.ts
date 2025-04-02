// @ts-nocheck
import * as R from 'ramda';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../../common/FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../../common/FinancialHorizTotals';
import {
  IBalanceSheetNetIncomeNode,
  IBalanceSheetTotal,
} from './BalanceSheet.types';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetRepository } from './BalanceSheetRepository';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';

export const BalanceSheetNetIncomeDatePeriodsPP = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends R.pipe(
    BalanceSheetComparsionPreviousPeriod,
    FinancialPreviousPeriod,
    FinancialHorizTotals,
  )(Base) {
    query: BalanceSheetQuery;
    repository: BalanceSheetRepository;

    /**
     * Retrieves the PY total income of the given date period.
     * @param {number} accountId -
     * @param {Date} toDate -
     * @return {number}
     */
    public getPPIncomeDatePeriodTotal = R.curry((toDate: Date) => {
      const PYPeriodsTotal = this.repository.incomePPPeriodsAccountsLedger
        .whereToDate(toDate)
        .getClosingBalance();

      const PYPeriodsOpeningTotal =
        this.repository.incomePPPeriodsOpeningAccountLedger.getClosingBalance();

      return PYPeriodsOpeningTotal + PYPeriodsTotal;
    });

    /**
     * Retrieves the PY total expense of the given date period.
     * @param {number} accountId -
     * @param {Date} toDate -
     * @returns {number}
     */
    public getPPExpenseDatePeriodTotal = R.curry((toDate: Date) => {
      const PYPeriodsTotal = this.repository.expensePPPeriodsAccountsLedger
        .whereToDate(toDate)
        .getClosingBalance();

      const PYPeriodsOpeningTotal =
        this.repository.expensePPPeriodsOpeningAccountLedger.getClosingBalance();

      return PYPeriodsOpeningTotal + PYPeriodsTotal;
    });

    /**
     * Retrieve the given net income total of the given period.
     * @param {number} accountId - Account id.
     * @param {Date} toDate - To date.
     * @returns {number}
     */
    public getPPNetIncomeDatePeriodTotal = R.curry((toDate: Date) => {
      const income = this.getPPIncomeDatePeriodTotal(toDate);
      const expense = this.getPPExpenseDatePeriodTotal(toDate);

      return income - expense;
    });

    /**
     * Assoc preivous period to account horizontal total node.
     * @param {IBalanceSheetAccountNode} node
     * @returns {}
     */
    public assocPreviousPeriodNetIncomeHorizTotal = R.curry(
      (node: IBalanceSheetNetIncomeNode, totalNode) => {
        const total = this.getPPNetIncomeDatePeriodTotal(
          totalNode.previousPeriodToDate.date,
        );
        return R.assoc('previousPeriod', this.getAmountMeta(total), totalNode);
      },
    );

    /**
     * Compose previous period to aggregate horizontal nodes.
     * @param   {IBalanceSheetTotal} node
     * @returns {IBalanceSheetTotal}
     */
    public previousPeriodNetIncomeHorizNodeComposer = R.curry(
      (
        node: IBalanceSheetNetIncomeNode,
        horiontalTotalNode: IBalanceSheetTotal,
      ): IBalanceSheetTotal => {
        return R.compose(
          R.when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode,
          ),
          R.when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode,
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodNetIncomeHorizTotal(node),
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy,
            ),
          ),
        )(horiontalTotalNode);
      },
    );

    /**
     * Associate the PP to net income horizontal nodes.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {IBalanceSheetCommonNode}
     */
    public assocPreviousPeriodNetIncomeHorizNode = (
      node: IBalanceSheetNetIncomeNode,
    ): IBalanceSheetNetIncomeNode => {
      const horizontalTotals = R.addIndex(R.map)(
        this.previousPeriodNetIncomeHorizNodeComposer(node),
        node.horizontalTotals,
      ) as IBalanceSheetTotal[];

      return R.assoc('horizontalTotals', horizontalTotals, node);
    };
  };
