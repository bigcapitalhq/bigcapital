import moment from 'moment';
import { omit, reverse } from 'lodash';
import { IAgingPeriod, IAgingPeriodClosingBalance, IAgingPeriodTotal } from 'interfaces';
import FinancialSheet from '../FinancialSheet';

export default class AgingSummaryReport extends FinancialSheet{

  /**
   * 
   * @param {Array} agingPeriods 
   * @param {Numeric} customerBalance 
   */
  contactAgingBalance(
    agingPeriods: IAgingPeriodClosingBalance[],
    receivableTotalCredit: number,
  ): IAgingPeriodTotal[] {
    let prevAging = 0;
    let receivableCredit = receivableTotalCredit;
    let diff = receivableCredit;

    const periods = reverse(agingPeriods).map((agingPeriod) => { 
      const agingAmount = (agingPeriod.closingBalance - prevAging);
      const subtract = Math.min(diff, agingAmount);
      diff -= Math.min(agingAmount, diff);

      const total = Math.max(agingAmount - subtract, 0);

      const output = {
        ...omit(agingPeriod, ['closingBalance']),
        total,
      };
      prevAging = agingPeriod.closingBalance;
      return output;
    });
    return reverse(periods);
  }

  /**
   * 
   * @param {*} asDay 
   * @param {*} agingDaysBefore 
   * @param {*} agingPeriodsFreq 
   */
  agingRangePeriods(asDay, agingDaysBefore, agingPeriodsFreq): IAgingPeriod[] {
    const totalAgingDays = agingDaysBefore * agingPeriodsFreq;
    const startAging = moment(asDay).startOf('day');
    const endAging = startAging.clone().subtract('days', totalAgingDays).endOf('day');

    const agingPeriods: IAgingPeriod[] = [];
    const startingAging = startAging.clone();

    let beforeDays = 1;
    let toDays = 0;

    while (startingAging > endAging) {
      const currentAging = startingAging.clone();
      startingAging.subtract('days', agingDaysBefore).endOf('day');
      toDays += agingDaysBefore;

      agingPeriods.push({
        fromPeriod: moment(currentAging).toDate(),
        toPeriod: moment(startingAging).toDate(),
        beforeDays: beforeDays === 1 ? 0 : beforeDays,
        toDays: toDays,
        ...(startingAging.valueOf() === endAging.valueOf()) ? {
          toPeriod: null,
          toDays: null,
        } : {},
      });
      beforeDays += agingDaysBefore;
    }
    return agingPeriods;
  }

}