import path from 'path';
import moment from 'moment';

global.__root_dir = path.join(__dirname, '..');
global.__resources_dir = path.join(global.__root_dir, 'resources');
global.__locales_dir = path.join(global.__resources_dir, 'locales');
global.__views_dir = path.join(global.__root_dir, 'views');
global.__storage_dir = path.join(global.__root_dir, 'storage');

moment.prototype.toMySqlDateTime = function () {
  return this.format('YYYY-MM-DD HH:mm:ss');
};
