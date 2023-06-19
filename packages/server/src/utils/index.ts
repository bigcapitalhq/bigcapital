import bcrypt from 'bcryptjs';
import moment from 'moment';
import _ from 'lodash';
import path from 'path';
import * as R from 'ramda';

import accounting from 'accounting';
import pug from 'pug';
import Currencies from 'js-money/lib/currency';
import definedOptions from '@/data/options';

export * from './table';

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

const dateRangeFromToCollection = (
  fromDate,
  toDate,
  addType = 'day',
  increment = 1
) => {
  const collection = [];
  const momentFromDate = moment(fromDate);
  const dateFormat = 'YYYY-MM-DD';

  for (
    let i = momentFromDate;
    i.isBefore(toDate, addType) || i.isSame(toDate, addType);
    i.add(increment, `${addType}s`)
  ) {
    collection.push({
      fromDate: i.startOf(addType).format(dateFormat),
      toDate: i.endOf(addType).format(dateFormat),
    });
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

  const newEntriesTable = _.chain(newEntries)
    .groupBy(idAttribute)
    .mapValues((group) => _.sumBy(group, amountAttribute) || 0)
    .mergeWith(oldEntriesTable, (objValue, srcValue) => {
      return _.isNumber(objValue) ? objValue - srcValue : srcValue * -1;
    })
    .value();

  return _.chain(newEntriesTable)
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

const getNegativeFormat = (formatName) => {
  switch (formatName) {
    case 'parentheses':
      return '(%s%v)';
    case 'mines':
      return '-%s%v';
  }
};

const getCurrencySign = (currencyCode) => {
  return _.get(Currencies, `${currencyCode}.symbol`);
};

const formatNumber = (
  balance,
  {
    precision = 2,
    divideOn1000 = false,
    excerptZero = false,
    negativeFormat = 'mines',
    thousand = ',',
    decimal = '.',
    zeroSign = '',
    money = true,
    currencyCode,
    symbol = '',
  }
) => {
  const formattedSymbol = getCurrencySign(currencyCode);
  const negFormat = getNegativeFormat(negativeFormat);
  const format = '%s%v';

  let formattedBalance = parseFloat(balance);

  if (divideOn1000) {
    formattedBalance /= 1000;
  }
  return accounting.formatMoney(
    formattedBalance,
    money ? formattedSymbol : symbol ? symbol : '',
    precision,
    thousand,
    decimal,
    {
      pos: format,
      neg: negFormat,
      zero: excerptZero ? zeroSign : format,
    }
  );
};

const isBlank = (value) => {
  return (_.isEmpty(value) && !_.isNumber(value)) || _.isNaN(value);
};

function defaultToTransform(value, defaultOrTransformedValue, defaultValue) {
  const _defaultValue =
    typeof defaultValue === 'undefined'
      ? defaultOrTransformedValue
      : defaultValue;

  const _transformedValue =
    typeof defaultValue === 'undefined' ? value : defaultOrTransformedValue;

  return value == null || value !== value || value === ''
    ? _defaultValue
    : _transformedValue;
}

const transformToMap = (objects, key) => {
  const map = new Map();

  objects.forEach((object) => {
    map.set(object[key], object);
  });
  return map;
};

const transactionIncrement = (s) => s.replace(/([0-8]|\d?9+)?$/, (e) => ++e);

const booleanValuesRepresentingTrue: string[] = ['true', '1'];
const booleanValuesRepresentingFalse: string[] = ['false', '0'];

const normalizeValue = (value: any): string =>
  value.toString().trim().toLowerCase();

const booleanValues: string[] = [
  ...booleanValuesRepresentingTrue,
  ...booleanValuesRepresentingFalse,
].map((value) => normalizeValue(value));

export const parseBoolean = <T>(value: any, defaultValue: T): T | boolean => {
  const normalizedValue = normalizeValue(value);
  if (booleanValues.indexOf(normalizedValue) === -1) {
    return defaultValue;
  }
  return booleanValuesRepresentingTrue.indexOf(normalizedValue) !== -1;
};

var increment = (n) => {
  return () => {
    n += 1;
    return n;
  };
};

const transformToMapBy = (collection, key) => {
  return new Map(Object.entries(_.groupBy(collection, key)));
};

const transformToMapKeyValue = (collection, key) => {
  return new Map(collection.map((item) => [item[key], item]));
};

const accumSum = (data, callback) => {
  return data.reduce((acc, _data) => {
    const amount = callback(_data);
    return acc + amount;
  }, 0);
};

const mergeObjectsByKey = (object1, object2, key) => {
  var merged = _.merge(_.keyBy(object1, key), _.keyBy(object2, key));
  return _.values(merged);
};

function templateRender(filePath, options) {
  const basePath = path.join(__dirname, '../../resources/views');
  return pug.renderFile(`${basePath}/${filePath}.pug`, options);
}

/**
 * All passed conditions should pass.
 * @param condsPairFilters
 * @returns
 */
export const allPassedConditionsPass = (condsPairFilters): Function => {
  const filterCallbacks = condsPairFilters
    .filter((cond) => cond[0])
    .map((cond) => cond[1]);

  return R.allPass(filterCallbacks);
};

export const runningAmount = (amount: number) => {
  let runningBalance = amount;

  return {
    decrement: (decrement: number) => {
      runningBalance -= decrement;
    },
    increment: (increment: number) => {
      runningBalance += increment;
    },
    amount: () => runningBalance,
  };
};

export const formatSmsMessage = (message, args) => {
  let formattedMessage = message;

  Object.keys(args).forEach((key) => {
    const variable = `{${key}}`;
    const value = _.defaultTo(args[key], '');

    formattedMessage = formattedMessage.replace(variable, value);
  });
  return formattedMessage;
};

export const parseDate = (date: string) => {
  return date ? moment(date).utcOffset(0).format('YYYY-MM-DD') : '';
};

const nestedArrayToFlatten = (
  collection,
  property = 'children',
  parseItem = (a, level) => a,
  level = 1
) => {
  const parseObject = (obj) =>
    parseItem(
      {
        ..._.omit(obj, [property]),
      },
      level
    );

  return collection.reduce((items, currentValue, index) => {
    let localItems = [...items];
    const parsedItem = parseObject(currentValue, level);
    localItems.push(parsedItem);

    if (Array.isArray(currentValue[property])) {
      const flattenArray = nestedArrayToFlatten(
        currentValue[property],
        property,
        parseItem,
        level + 1
      );
      localItems = _.concat(localItems, flattenArray);
    }
    return localItems;
  }, []);
};

const assocDepthLevelToObjectTree = (
  objects,
  level = 1,
  propertyName = 'level'
) => {
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    object[propertyName] = level;

    if (object.children) {
      assocDepthLevelToObjectTree(object.children, level + 1, propertyName);
    }
  }
  return objects;
};

const castCommaListEnvVarToArray = (envVar: string): Array<string> => {
  return envVar ? envVar?.split(',')?.map(_.trim) : [];
};

export {
  templateRender,
  accumSum,
  increment,
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
  transformToMap,
  transactionIncrement,
  transformToMapBy,
  dateRangeFromToCollection,
  transformToMapKeyValue,
  mergeObjectsByKey,
  nestedArrayToFlatten,
  assocDepthLevelToObjectTree,
  castCommaListEnvVarToArray
};
