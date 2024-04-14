import moment from 'moment';

export default class SubscriptionPeriod {
  start: Date;
  end: Date;
  interval: string;
  count: number;

  /**
   * Constructor method.
   * @param {string} interval -
   * @param {number} count -
   * @param {Date} start -
   */
  constructor(interval: string = 'month', count: number, start?: Date) {
    this.interval = interval;
    this.count = count;
    this.start = start;

    if (!start) {
      this.start = moment().toDate();
    }
    this.end = moment(start).add(count, interval).toDate();
  }

  getStartDate() {
    return this.start;
  }

  getEndDate() {
    return this.end;
  }

  getInterval() {
    return this.interval;
  }

  getIntervalCount() {
    return this.interval;
  }
}
