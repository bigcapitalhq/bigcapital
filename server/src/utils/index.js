import bcrypt from 'bcryptjs';
import moment from 'moment';
import _ from 'lodash';
import definedOptions from 'data/options';

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

const itemsStartWith = (items, char) => {
  return items.filter((item) => item.indexOf(char) === 0);
};

const getTotalDeep = (items, deepProp, totalProp) =>
  items.reduce((acc, item) => {
    const total = Array.isArray(item[deepProp])
      ? getTotalDeep(item[deepProp], deepProp, totalProp)
      : 0;
    return _.sumBy(item, totalProp) + total + acc;
  }, 0);

function applyMixins(derivedCtor, baseCtors) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      );
    });
  });
}

const formatDateFields = (inputDTO, fields, format = 'YYYY-MM-DD') => {
  const _inputDTO = { ...inputDTO };

  fields.forEach((field) => {
    if (_inputDTO[field]) {
      _inputDTO[field] = moment(_inputDTO[field]).format(format);
    }
  });
  return _inputDTO;
};

const getDefinedOptions = () => {
  const options = [];

  Object.keys(definedOptions).forEach((groupKey) => {
    const groupOptions = definedOptions[groupKey];
    groupOptions.forEach((option) => {
      options.push({ ...option, group: groupKey });
    });
  });
  return options;
};

const getDefinedOption = (key, group) => {
  return definedOptions?.[group]?.find((option) => option.key == key);
};

const isDefinedOptionConfigurable = (key, group) => {
  const definedOption = getDefinedOption(key, group);
  console.log(definedOption, 'definedOption');

  return definedOption?.config || false;
};

const entriesAmountDiff = (
  newEntries,
  oldEntries,
  amountAttribute,
  idAttribute
) => {
  const oldEntriesTable = _.chain(oldEntries)
    .groupBy(idAttribute)
    .mapValues((group) => _.sumBy(group, amountAttribute) || 0)
    .value();

  return _.chain(newEntries)
    .groupBy(idAttribute)
    .mapValues((group) => _.sumBy(group, amountAttribute) || 0)
    .mapValues((value, key) => value - (oldEntriesTable[key] || 0))
    .mapValues((value, key) => ({
      [idAttribute]: key,
      [amountAttribute]: value,
    }))
    .filter((entry) => entry[amountAttribute] != 0)
    .values()
    .value();
};

const convertEmptyStringToNull = (value) => {
  return typeof value === 'string'
    ? value.trim() === ''
      ? null
      : value
    : value;
};

const formatNumber = (balance, { noCents = false, divideOn1000 = false }) => {
  let formattedBalance = parseFloat(balance);

  if (noCents) {
    formattedBalance = parseInt(formattedBalance, 10);
  }
  if (divideOn1000) {
    formattedBalance /= 1000;
  }
  return formattedBalance + '';
};

const isBlank = (value) => {
  return _.isEmpty(value) && !_.isNumber(value) || _.isNaN(value);
}

function defaultToTransform(
  value,
  defaultOrTransformedValue,
  defaultValue,
) {
  const _defaultValue =
    typeof defaultValue === 'undefined'
      ? defaultOrTransformedValue
      : defaultValue;

  const _transfromedValue =
    typeof defaultValue === 'undefined' ? value : defaultOrTransformedValue;

  return value == null || value !== value || value === ''
    ? _defaultValue
    : _transfromedValue;
}


export {
  hashPassword,
  origin,
  dateRangeCollection,
  dateRangeFormat,
  mapValuesDeep,
  mapKeysDeep,
  promiseSerial,
  flatToNestedArray,
  itemsStartWith,
  getTotalDeep,
  applyMixins,
  formatDateFields,
  isDefinedOptionConfigurable,
  getDefinedOption,
  getDefinedOptions,
  entriesAmountDiff,
  convertEmptyStringToNull,
  formatNumber,
  isBlank,
  defaultToTransform,
};
