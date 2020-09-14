import path from 'path';
import moment from 'moment';

global.__root = path.resolve(__dirname);

moment.prototype.toMySqlDateTime = function () {
  return this.format('YYYY-MM-DD HH:mm:ss');
};
