import moment, { unitOfTime } from 'moment';

export default class SubscriptionPeriod {
  private start: Date;
  private end: Date;
  private interval: string;
  private count: number;

  /**
   * Constructor method.
   * @param {string} interval -
   * @param {number} count -
   * @param {Date} start -
   */
  constructor(
    interval: unitOfTime.DurationConstructor = 'month',
    count: number,
    start?: Date
  ) {
    this.interval = interval;
    this.count = count;
    this.start = start;

    if (!start) {
      this.start = moment().toDate();
    }
    if (count === Infinity) {
      this.end = null;
    } else {
      this.end = moment(start).add(count, interval).toDate();
    }
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
    return this.count;
  }
}
