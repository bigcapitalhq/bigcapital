import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { assoc, when } from '@/common/fp';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../../common/FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../../common/FinancialHorizTotals';
import { IFinancialDatePeriodsUnit } from '../../types/Report.types';
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
  class extends flow(
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
    public getPPIncomeDatePeriodTotal = (toDate: Date): number => {
      const PYPeriodsTotal = this.repository.incomePPPeriodsAccountsLedger
        .whereToDate(toDate)
        .getClosingBalance();

      const PYPeriodsOpeningTotal =
        this.repository.incomePPPeriodsOpeningAccountLedger.getClosingBalance();

      return PYPeriodsOpeningTotal + PYPeriodsTotal;
    };

    /**
     * Retrieves the PY total expense of the given date period.
     * @param {number} accountId -
     * @param {Date} toDate -
     * @returns {number}
     */
    public getPPExpenseDatePeriodTotal = (toDate: Date): number => {
      const PYPeriodsTotal = this.repository.expensePPPeriodsAccountsLedger
        .whereToDate(toDate)
        .getClosingBalance();

      const PYPeriodsOpeningTotal =
        this.repository.expensePPPeriodsOpeningAccountLedger.getClosingBalance();

      return PYPeriodsOpeningTotal + PYPeriodsTotal;
    };

    /**
     * Retrieve the given net income total of the given period.
     * @param {number} accountId - Account id.
     * @param {Date} toDate - To date.
     * @returns {number}
     */
    public getPPNetIncomeDatePeriodTotal = (toDate: Date): number => {
      const income = this.getPPIncomeDatePeriodTotal(toDate);
      const expense = this.getPPExpenseDatePeriodTotal(toDate);

      return income - expense;
    };

    /**
     * Assoc preivous period to account horizontal total node.
     * @param {IBalanceSheetAccountNode} node
     * @returns {}
     */
    public assocPreviousPeriodNetIncomeHorizTotal =
      (_node: IBalanceSheetNetIncomeNode) =>
      (totalNode: any): IBalanceSheetTotal => {
        const total = this.getPPNetIncomeDatePeriodTotal(
          totalNode.previousPeriodToDate.date,
        );
        return assoc('previousPeriod', this.getAmountMeta(total), totalNode);
      };

    /**
     * Compose previous period to aggregate horizontal nodes.
     * @param   {IBalanceSheetTotal} node
     * @returns {IBalanceSheetTotal}
     */
    public previousPeriodNetIncomeHorizNodeComposer =
      (node: IBalanceSheetNetIncomeNode) =>
      (horiontalTotalNode): IBalanceSheetTotal => {
        return flow(
          when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy as IFinancialDatePeriodsUnit,
            ),
          ),
          when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodNetIncomeHorizTotal(node),
          ),
          when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode,
          ),
          when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode,
          ),
        )(horiontalTotalNode) as IBalanceSheetTotal;
      };

    /**
     * Associate the PP to net income horizontal nodes.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {IBalanceSheetCommonNode}
     */
    public assocPreviousPeriodNetIncomeHorizNode = (
      node: IBalanceSheetNetIncomeNode,
    ): IBalanceSheetNetIncomeNode => {
      const horizontalTotals = A.mapWithIndex(
        (_index: number, totalNode: IBalanceSheetTotal) =>
          this.previousPeriodNetIncomeHorizNodeComposer(node)(totalNode),
      )(node.horizontalTotals) as IBalanceSheetTotal[];

      return assoc('horizontalTotals', horizontalTotals, node);
    };
  };
