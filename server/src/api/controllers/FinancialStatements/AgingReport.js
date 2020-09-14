import moment from 'moment';
import { validationResult } from 'express-validator';
import { omit, reverse } from 'lodash';
import BaseController from 'api/controllers/BaseController';

export default class AgingReport extends BaseController{

  /**
   * Express validator middleware. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static validateResults(req, res, next) {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.boom.badData(null, {
        code: 'validation_error', ...validationErrors,
      });
    }
    next();
  }

  /**
   * 
   * @param {Array} agingPeriods 
   * @param {Numeric} customerBalance 
   */
  static contactAgingBalance(agingPeriods, receivableTotalCredit) {
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
  static agingRangePeriods(asDay, agingDaysBefore, agingPeriodsFreq) {
    const totalAgingDays = agingDaysBefore * agingPeriodsFreq;
    const startAging = moment(asDay).startOf('day');
    const endAging = startAging.clone().subtract('days', totalAgingDays).endOf('day');

    const agingPeriods = [];
    const startingAging = startAging.clone();

    let beforeDays = 1;
    let toDays = 0;

    while (startingAging > endAging) {
      const currentAging = startingAging.clone();
      startingAging.subtract('days', agingDaysBefore).endOf('day');
      toDays += agingDaysBefore;

      agingPeriods.push({
        from_period: moment(currentAging).toDate(),
        to_period: moment(startingAging).toDate(),
        before_days: beforeDays === 1 ? 0 : beforeDays,
        to_days: toDays,
        ...(startingAging.valueOf() === endAging.valueOf()) ? {
          to_period: null,
          to_days: null,
        } : {},
      });
      beforeDays += agingDaysBefore;
    }
    return agingPeriods;
  }

  /**
   * 
   * @param {*} filter 
   */
  static formatNumberClosure(filter) {
    return (balance) => {
      let formattedBalance = parseFloat(balance);
    
      if (filter.no_cents) {
        formattedBalance = parseInt(formattedBalance, 10);
      }
      if (filter.divide_1000) {
        formattedBalance /= 1000;
      }
      return formattedBalance;
    };
  }
}