import moment from 'moment';

moment.prototype.toMySqlDateTime = function toMySqlDateTime() {
  return this.format('YYYY-MM-DD HH:mm:ss');
};
