import * as R from 'ramda';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { FinancialPreviousPeriod } from '../FinancialPreviousPeriod';
import { FinancialHorizTotals } from '../FinancialHorizTotals';
import { IBalanceSheetNetIncomeNode, IBalanceSheetTotal } from '@/interfaces';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import BalanceSheetRepository from './BalanceSheetRepository';

export const BalanceSheetNetIncomeDatePeriodsPP = (Base: any) =>
  class extends R.compose(
    BalanceSheetComparsionPreviousPeriod,
    FinancialPreviousPeriod,
    FinancialHorizTotals
  )(Base) {
    query: BalanceSheetQuery;
    repository: BalanceSheetRepository;

    /**
     * Retrieves the PY total income of the given date period.
     * @param {number} accountId -
     * @param {Date} toDate -
     * @return {number}
     */
    private getPPIncomeDatePeriodTotal = R.curry((toDate: Date) => {
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
    private getPPExpenseDatePeriodTotal = R.curry((toDate: Date) => {
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
    private getPPNetIncomeDatePeriodTotal = R.curry((toDate: Date) => {
      const income = this.getPPIncomeDatePeriodTotal(toDate);
      const expense = this.getPPExpenseDatePeriodTotal(toDate);

      return income - expense;
    });

    /**
     * Assoc preivous period to account horizontal total node.
     * @param {IBalanceSheetAccountNode} node
     * @returns {}
     */
    private assocPreviousPeriodNetIncomeHorizTotal = R.curry(
      (node: IBalanceSheetNetIncomeNode, totalNode) => {
        const total = this.getPPNetIncomeDatePeriodTotal(
          totalNode.previousPeriodToDate.date
        );
        return R.assoc('previousPeriod', this.getAmountMeta(total), totalNode);
      }
    );

    /**
     * Compose previous period to aggregate horizontal nodes.
     * @param   {IBalanceSheetTotal} node
     * @returns {IBalanceSheetTotal}
     */
    private previousPeriodNetIncomeHorizNodeComposer = R.curry(
      (
        node: IBalanceSheetNetIncomeNode,
        horiontalTotalNode: IBalanceSheetTotal
      ): IBalanceSheetTotal => {
        return R.compose(
          R.when(
            this.query.isPreviousPeriodPercentageActive,
            this.assocPreviousPeriodTotalPercentageNode
          ),
          R.when(
            this.query.isPreviousPeriodChangeActive,
            this.assocPreviousPeriodTotalChangeNode
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodNetIncomeHorizTotal(node)
          ),
          R.when(
            this.query.isPreviousPeriodActive,
            this.assocPreviousPeriodHorizNodeFromToDates(
              this.query.displayColumnsBy
            )
          )
        )(horiontalTotalNode);
      }
    );

    /**
     * Associate the PP to net income horizontal nodes.
     * @param   {IBalanceSheetCommonNode} node
     * @returns {IBalanceSheetCommonNode}
     */
    public assocPreviousPeriodNetIncomeHorizNode = (
      node: IBalanceSheetNetIncomeNode
    ): IBalanceSheetNetIncomeNode => {
      const horizontalTotals = R.addIndex(R.map)(
        this.previousPeriodNetIncomeHorizNodeComposer(node),
        node.horizontalTotals
      ) as IBalanceSheetTotal[];

      return R.assoc('horizontalTotals', horizontalTotals, node);
    };
  };
