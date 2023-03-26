import moment from 'moment';
import {
  IAgingPeriod,
} from '@/interfaces';
import FinancialSheet from "../FinancialSheet";


export default abstract class AgingReport extends FinancialSheet{
  /**
   * Retrieve the aging periods range.
   * @param {string} asDay
   * @param {number} agingDaysBefore
   * @param {number} agingPeriodsFreq
   */
  agingRangePeriods(
    asDay: Date|string,
    agingDaysBefore: number,
    agingPeriodsFreq: number
  ): IAgingPeriod[] {
    const totalAgingDays = agingDaysBefore * agingPeriodsFreq;
    const startAging = moment(asDay).startOf('day');
    const endAging = startAging
      .clone()
      .subtract(totalAgingDays, 'days')
      .endOf('day');

    const agingPeriods: IAgingPeriod[] = [];
    const startingAging = startAging.clone();

    let beforeDays = 1;
    let toDays = 0;

    while (startingAging > endAging) {
      const currentAging = startingAging.clone();
      startingAging.subtract(agingDaysBefore, 'days').endOf('day');
      toDays += agingDaysBefore;

      agingPeriods.push({
        fromPeriod: moment(currentAging).format('YYYY-MM-DD'),
        toPeriod: moment(startingAging).format('YYYY-MM-DD'),
        beforeDays: beforeDays === 1 ? 0 : beforeDays,
        toDays: toDays,
        ...(startingAging.valueOf() === endAging.valueOf()
          ? {
              toPeriod: null,
              toDays: null,
            }
          : {}),
      });
      beforeDays += agingDaysBefore;
    }
    return agingPeriods;
  }
}