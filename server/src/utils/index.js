import bcrypt from 'bcryptjs';
import moment from 'moment';
import _ from 'lodash';
const { map, isArray, isPlainObject, mapKeys, mapValues } = require('lodash');

const hashPassword = (password) =>
  new Promise((resolve) => {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        resolve(hash);
      });
    });
  });

const origin = (request) => `${request.protocol}://${request.hostname}`;

const dateRangeCollection = (
  fromDate,
  toDate,
  addType = 'day',
  increment = 1
) => {
  const collection = [];
  const momentFromDate = moment(fromDate);
  let dateFormat = '';

  switch (addType) {
    case 'day':
    default:
      dateFormat = 'YYYY-MM-DD';
      break;
    case 'month':
    case 'quarter':
      dateFormat = 'YYYY-MM';
      break;
    case 'year':
      dateFormat = 'YYYY';
      break;
  }
  for (
    let i = momentFromDate;
    i.isBefore(toDate, addType) || i.isSame(toDate, addType);
    i.add(increment, `${addType}s`)
  ) {
    collection.push(i.endOf(addType).format(dateFormat));
  }
  return collection;
};

const dateRangeFormat = (rangeType) => {
  switch (rangeType) {
    case 'year':
      return 'YYYY';
    case 'month':
    case 'quarter':
    default:
      return 'YYYY-MM';
  }
};

function mapKeysDeep(obj, cb, isRecursive) {
  if (!obj && !isRecursive) {
    return {};
  }
  if (!isRecursive) {
    if (
      typeof obj === 'string' ||
      typeof obj === 'number' ||
      typeof obj === 'boolean'
    ) {
      return {};
    }
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => mapKeysDeep(item, cb, true));
  }
  if (!_.isPlainObject(obj)) {
    return obj;
  }
  const result = _.mapKeys(obj, cb);
  return _.mapValues(result, (value) => mapKeysDeep(value, cb, true));
}

const mapValuesDeep = (v, callback) =>
  _.isObject(v)
    ? _.mapValues(v, (v) => mapValuesDeep(v, callback))
    : callback(v);

const promiseSerial = (funcs) => {
  return funcs.reduce(
    (promise, func) =>
      promise.then((result) =>
        func().then(Array.prototype.concat.bind(result))
      ),
    Promise.resolve([])
  );
};

const flatToNestedArray = (
  data,
  config = { id: 'id', parentId: 'parent_id' }
) => {
  const map = {};
  const nestedArray = [];

  data.forEach((item) => {
    map[item[config.id]] = item;
    map[item[config.id]].children = [];
  });

  data.forEach((item) => {
    const parentItemId = item[config.parentId];

    if (!item[config.parentId]) {
      nestedArray.push(item);
    }
    if (parentItemId) {
      map[parentItemId].children.push(item);
    }
  });

  return nestedArray;
};

export {
  hashPassword,
  origin,
  dateRangeCollection,
  dateRangeFormat,
  mapValuesDeep,
  mapKeysDeep,
  promiseSerial,
  flatToNestedArray,
};
