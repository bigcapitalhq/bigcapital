import bcrypt from 'bcryptjs';
import moment from 'moment';
import _ from 'lodash';
const { map, isArray, isPlainObject, mapKeys, mapValues } = require('lodash')


const hashPassword = (password) => new Promise((resolve) => {
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (err, hash) => { resolve(hash); });
  });
});

const origin = (request) => `${request.protocol}://${request.hostname}`;

const dateRangeCollection = (fromDate, toDate, addType = 'day', increment = 1) => {
  const collection = [];
  const momentFromDate = moment(fromDate);
  let dateFormat = '';

  switch (addType) {
    case 'day':
    default:
      dateFormat = 'YYYY-MM-DD'; break;
    case 'month':
    case 'quarter':
      dateFormat = 'YYYY-MM'; break;
    case 'year':
      dateFormat = 'YYYY'; break;
  }
  for (let i = momentFromDate;
    (i.isBefore(toDate, addType) || i.isSame(toDate, addType));
    i.add(increment, `${addType}s`)) {
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


const mapKeysDeep = (obj, cb) => {
  if (_.isArray(obj)) {
      return obj.map(innerObj => mapKeysDeep(innerObj, cb));
  }
  else if (_.isObject(obj)) {
      return _.mapValues(
          _.mapKeys(obj, cb),
          val => mapKeysDeep(val, cb),
      )
  } else {
      return obj;
  }
}

const mapValuesDeep = (v, callback) => (
  _.isObject(v)
    ? _.mapValues(v, v => mapValuesDeep(v, callback))
    : callback(v));

export {
  hashPassword,
  origin,
  dateRangeCollection,
  dateRangeFormat,
  mapValuesDeep,
  mapKeysDeep,
};
