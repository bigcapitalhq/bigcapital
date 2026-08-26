import * as moment from 'moment';

declare module 'moment' {
  interface Moment {
    toMySqlDateTime(): string;
  }
}

// Extends moment prototype to add a new method to format date to MySQL datetime format.
moment.prototype.toMySqlDateTime = function () {
  return this.format('YYYY-MM-DD HH:mm:ss');
};
