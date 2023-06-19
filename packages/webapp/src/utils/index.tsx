// @ts-nocheck
import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import * as R from 'ramda';
import Currencies from 'js-money/lib/currency';
import clsx from 'classnames';

import { Intent } from '@blueprintjs/core';
import Currency from 'js-money/lib/currency';
import accounting from 'accounting';
import deepMapKeys from 'deep-map-keys';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { isEqual, castArray, isEmpty, includes, pickBy } from 'lodash';

import jsCookie from 'js-cookie';

export * from './deep';

export const getCookie = (name, defaultValue) =>
  _.defaultTo(jsCookie.get(name), defaultValue);

export const setCookie = (name, value, expiry = 365, secure = false) => {
  jsCookie.set(name, value, { expires: expiry, path: '/', secure });
};

export const removeCookie = (name) => {
  return jsCookie.remove(name, { path: '/' });
};

export function removeEmptyFromObject(obj) {
  obj = Object.assign({}, obj);
  var keys = Object.keys(obj);

  keys.forEach(function (key) {
    const value = obj[key];

    if (value === '' || value === null || value === undefined) {
      delete obj[key];
    }
  });
  return obj;
}

export const optionsMapToArray = (optionsMap, service = '') => {
  return Object.keys(optionsMap).map((optionKey) => {
    const optionValue = optionsMap[optionKey];

    return {
      key: service ? `${service}_${optionKey}` : `${optionKey}`,
      value: optionValue,
    };
  });
};

export const optionsArrayToMap = (optionsArray) => {
  return optionsArray.reduce((map, option) => {
    map[option.key] = option.value;
    return map;
  }, {});
};

export function numberComma(number) {
  number = typeof number === 'number' ? String(number) : number;

  const parts = number.split('.');

  const integer = parts[0] || '0';
  const decimal = parts[1];
  const postfix = decimal ? `.${decimal}` : '';

  return `${integer.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}${postfix}`;
}

export const momentFormatter = (format) => {
  return {
    formatDate: (date) => moment(date).format(format),
    parseDate: (str) => moment(str, format).toDate(),
    placeholder: `${format}`,
  };
};

/** Event handler that exposes the target element's value as a boolean. */
export const handleBooleanChange = (handler) => {
  return (event) => handler(event.target.checked);
};

/** Event handler that exposes the target element's value as a string. */
export const handleStringChange = (handler) => {
  return (event) => handler(event.target.value);
};

/** Event handler that exposes the target element's value as a number. */
export const handleNumberChange = (handler) => {
  return handleStringChange((value) => handler(+value));
};

export const handleDateChange = (handler) => {
  return (date) => handler(moment(date).format('YYYY-MM-DD'), date);
};

export const objectKeysTransform = (obj, transform) => {
  return Object.keys(obj).reduce((acc, key) => {
    const computedKey = transform(key);
    acc[computedKey] = obj[key];
    return acc;
  }, {});
};

export const compose = (...funcs) =>
  funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args)),
    (arg) => arg,
  );

export const getObjectDiff = (a, b) => {
  return _.reduce(
    a,
    (result, value, key) => {
      return _.isEqual(value, b[key]) ? result : result.concat(key);
    },
    [],
  );
};

export const parseDateRangeQuery = (keyword) => {
  const queries = {
    today: {
      range: 'day',
    },
    this_year: {
      range: 'year',
    },
    this_month: {
      range: 'month',
    },
    this_week: {
      range: 'week',
    },
    this_quarter: {
      range: 'quarter',
    },
  };

  if (typeof queries[keyword] === 'undefined') {
    throw new Error(`The date range query ${keyword} is not defined.`);
  }
  const query = queries[keyword];

  return {
    fromDate: moment().startOf(query.range).toDate(),
    toDate: moment().endOf(query.range).toDate(),
  };
};

export const defaultExpanderReducer = (tableRows, level) => {
  const expended = [];

  const walker = (rows, parentIndex = null, currentLevel = 1) => {
    return rows.forEach((row, index) => {
      const _index = parentIndex ? `${parentIndex}.${index}` : `${index}`;
      expended[_index] = true;

      if (row.children && currentLevel < level) {
        walker(row.children, _index, currentLevel + 1);
      }
    }, {});
  };
  walker(tableRows);
  return expended;
};

export function formattedAmount(cents, currencyCode = '', props) {
  const currency = Currency[currencyCode];

  const parsedCurrency = {
    symbol: '',
    decimal_digits: 0,
    ...currency,
  };
  const parsedProps = {
    noZero: false,
    ...props,
  };
  const formatOptions = {
    symbol: parsedCurrency.symbol,
    precision: parsedCurrency.decimal_digits,
    format: {
      pos: '%s%v',
      neg: '%s-%v',
      zero: parsedProps.noZero ? '' : '%s%v',
    },
  };

  return accounting.formatMoney(cents, formatOptions);
}

export function formattedNumber(amount, props) {
  const parsedProps = {
    noZero: false,
    ...props,
  };
  const formatOptions = {
    symbol: '',
    precision: 0,
    format: {
      pos: '%s%v',
      neg: '%s-%v',
      zero: parsedProps.noZero ? '' : '%s%v',
    },
    ...props,
  };
  return accounting.formatMoney(amount, formatOptions);
}

export function formattedExchangeRate(amount, currency) {
  const options = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  };

  const formatter = new Intl.NumberFormat(undefined, options);

  return formatter.format(amount);
}

export const ConditionalWrapper = ({ condition, wrapper, children, ...rest }) =>
  condition ? wrapper({ children, ...rest }) : children;

export const checkRequiredProperties = (obj, properties) => {
  return properties.some((prop) => {
    const value = obj[prop];
    return value === '' || value === null || value === undefined;
  });
};

export const saveFilesInAsync = (files, actionCb, extraTasks) => {
  const opers = [];

  files.forEach((file) => {
    const formData = new FormData();
    formData.append('attachment', file.file);
    // const oper = new Progress((resolve, reject, progress) => {
    //   actionCb(formData, file, (requestProgress) => {
    //     progress(requestProgress);
    //   })
    //     .then((data) => {
    //       resolve(data);
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
    // opers.push(oper);
  });
  // return Progress.all(opers);
};

export const firstLettersArgs = (...args) => {
  let letters = [];

  args.forEach((word) => {
    if (typeof word === 'string') {
      letters.push(word.charAt(0));
    }
  });
  return letters.join('').toUpperCase();
};

export const uniqueMultiProps = (items, props) => {
  return _.uniqBy(items, (item) => {
    return JSON.stringify(_.pick(item, props));
  });
};

export const transformUpdatedRows = (rows, rowIndex, columnIdOrObj, value) => {
  const columnId = typeof columnIdOrObj !== 'object' ? columnIdOrObj : null;
  const updateTable = typeof columnIdOrObj === 'object' ? columnIdOrObj : null;
  const newData = updateTable ? updateTable : { [columnId]: value };

  return rows.map((row, index) => {
    if (index === rowIndex) {
      return { ...rows[rowIndex], ...newData };
    }
    return { ...row };
  });
};

export const tansformDateValue = (date) => {
  return moment(date).toDate() || new Date();
};

export const repeatValue = (value, len) => {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
};

export const flatToNestedArray = (
  data,
  config = { id: 'id', parentId: 'parent_id' },
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
    if (parentItemId && map[parentItemId]) {
      map[parentItemId].children.push(item);
    }
  });
  return nestedArray;
};

export const orderingLinesIndexes = (lines, attribute = 'index') => {
  return lines.map((line, index) => ({ ...line, [attribute]: index + 1 }));
};

export const transformToObject = (arr, key) => {
  return arr.reduce(function (acc, cur, i) {
    acc[key ? cur[key] : i] = cur;
    return acc;
  }, {});
};

export const itemsStartWith = (items, char) => {
  return items.filter((item) => item.indexOf(char) === 0);
};

export const saveInvoke = (func, ...rest) => {
  return func && func(...rest);
};

export const safeInvoke = (func, ...rest) => {
  func && func(...rest);
};

export const transformToForm = (obj, emptyInitialValues) => {
  return _.pickBy(
    obj,
    (val, key) => val !== null && Object.keys(emptyInitialValues).includes(key),
  );
};

export function inputIntent({ error, touched }) {
  return error && touched ? Intent.DANGER : '';
}

export function listToTree(
  inputList,
  {
    idFieldKey = 'id',
    parentFieldKey = 'parent_account_id',
    nodeMapper = (node) => ({ ...node }),
  },
) {
  var map = {},
    node,
    roots = [],
    i;
  const list = inputList.map((item) => nodeMapper(item));

  for (i = 0; i < list.length; i += 1) {
    map[list[i][idFieldKey]] = i;
    list[i].children = [];
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];

    if (node[parentFieldKey]) {
      list[map[node[parentFieldKey]]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function treeToList(
  list,
  {
    idFieldKey = 'id',
    childrenFieldKey = 'children',
    nodeMapper = (node, depth) => node,
    nodeFilter = (node, depth) => true,
  },
) {
  let depth = 0;

  const walker = (tree) => {
    return tree.reduce((acc, o) => {
      depth += 1;

      if (o[idFieldKey] && nodeFilter(o, depth)) {
        acc.push(nodeMapper(o, depth));
      }
      if (o[childrenFieldKey]) {
        acc = acc.concat(walker(o.children));
      }
      depth -= 1;
      return acc;
    }, []);
  };
  return walker(list);
}

export function defaultToTransform(
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

export function isBlank(value) {
  return (_.isEmpty(value) && !_.isNumber(value)) || _.isNaN(value);
}

export const getColumnWidth = (
  rows,
  accessor,
  { maxWidth, minWidth, magicSpacing = 14 },
  headerText = '',
) => {
  const cellLength = Math.max(
    ...rows.map((row) => (`${_.get(row, accessor)}` || '').length),
    headerText.length,
  );
  let result = cellLength * magicSpacing;

  result = minWidth ? Math.max(minWidth, result) : result;
  result = maxWidth ? Math.min(maxWidth, result) : result;

  return result;
};

export const getForceWidth = (text, magicSpacing = 14) => {
  const textLength = text.length;
  const result = textLength * magicSpacing;

  return result;
};

export const toSafeNumber = (number) => {
  return _.toNumber(_.defaultTo(number, 0));
};

export const transformToCamelCase = (object) => {
  return deepMapKeys(object, (key) => _.camelCase(key));
};

export const transfromToSnakeCase = (object) => {
  return deepMapKeys(object, (key) => _.snakeCase(key));
};

export const transformTableQueryToParams = (object) => {
  return transfromToSnakeCase(object);
};

export function flatObject(obj) {
  const flatObject = {};
  const path = []; // current path

  function dig(obj) {
    if (obj !== Object(obj)) {
      return (flatObject[path.join('.')] = obj);
    }

    for (let key in obj) {
      path.push(key);
      dig(obj[key]);
      path.pop();
    }
  }

  dig(obj);
  return flatObject;
}

export function randomNumber(min, max) {
  if (min > max) {
    let temp = max;
    max = min;
    min = temp;
  }
  if (min <= 0) {
    return Math.floor(Math.random() * (max + Math.abs(min) + 1)) + min;
  } else {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export function transformResponse(response) {
  return transformToCamelCase(response);
}

export function transactionNumber(prefix, number) {
  const codes = [];

  if (prefix) {
    codes.push(prefix);
  }
  if (number) {
    codes.push(number);
  }
  return codes.join('');
}

export function safeCallback(callback, ...args) {
  return () => callback && callback(...args);
}

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);

/**
 * Determines whether the table has empty status.
 */
export const isTableEmptyStatus = ({ data, pagination, filterMeta }) => {
  return [
    _.isEmpty(data),
    _.isEmpty(filterMeta.view),
    pagination.page === 1,
  ].every((cond) => cond === true);
};

/**
 * Transformes the pagination meta to table props.
 */
export function getPagesCountFromPaginationMeta(pagination) {
  const { pageSize, total } = pagination;

  return Math.ceil(total / pageSize);
}

function transformFilterRoles(filterRoles) {
  return JSON.stringify(filterRoles);
}

/**
 * Transformes the table state to url query.
 */
export function transformTableStateToQuery(tableState) {
  const { pageSize, pageIndex, viewSlug, sortBy } = tableState;

  const query = {
    pageSize,
    page: pageIndex + 1,
    ...(tableState.filterRoles
      ? {
          stringified_filter_roles: transformFilterRoles(
            tableState.filterRoles,
          ),
        }
      : {}),
    ...(viewSlug ? { viewSlug } : {}),
    ...(Array.isArray(sortBy) && sortBy.length > 0
      ? {
          column_sort_by: sortBy[0].id,
          sort_order: sortBy[0].desc ? 'desc' : 'asc',
        }
      : {}),
  };
  return transfromToSnakeCase(query);
}

/**
 * Transformes the global table state to table state.
 */
export function globalTableStateToTable(globalState) {
  return {
    ..._.omit(globalState, ['customViewId']),
  };
}

/**
 * Transformes the pagination meta response.
 */
export function transformPagination(pagination) {
  const transformed = transformResponse(pagination);

  return {
    ...transformed,
    pagesCount: getPagesCountFromPaginationMeta(transformed),
  };
}

export function removeRowsByIndex(rows, rowIndex) {
  const removeIndex = parseInt(rowIndex, 10);
  const newRows = rows.filter((row, index) => index !== removeIndex);

  return newRows;
}

export function safeSumBy(entries, getter) {
  return _.chain(entries)
    .map((row) => toSafeNumber(_.get(row, getter)))
    .sum()
    .value();
}

export const fullAmountPaymentEntries = (entries) => {
  return entries.map((item) => ({
    ...item,
    payment_amount: item.due_amount,
  }));
};

export const amountPaymentEntries = (amount, entries) => {
  let total = amount;

  return entries.map((item) => {
    const diff = Math.min(item.due_amount, total);
    total -= Math.max(diff, 0);

    return {
      ...item,
      payment_amount: diff,
    };
  });
};

export const updateAutoAddNewLine = (defaultEntry, props) => (entries) => {
  const newEntries = [...entries];
  const lastEntry = _.last(newEntries);
  const newLine = props.filter((entryKey) => !isBlank(lastEntry[entryKey]));

  return newLine.length > 0 ? [...entries, defaultEntry] : [...entries];
};

/**
 * Ensure min entries lines.
 * @param {number} min
 * @param {any} defaultEntry
 */
export const updateMinEntriesLines = (min, defaultEntry) => (lines) => {
  if (lines.length < min) {
    const diffLines = Math.max(min - lines.length, 0);
    return [...lines, ...repeatValue(defaultEntry, diffLines)];
  }
  return lines;
};

export const updateRemoveLineByIndex = (rowIndex) => (entries) => {
  const removeIndex = parseInt(rowIndex, 10);
  return entries.filter((row, index) => index !== removeIndex);
};

export const updateTableCell = (rowIndex, columnId, value) => (old) => {
  return old.map((row, index) => {
    if (index === rowIndex) {
      return {
        ...old[rowIndex],
        [columnId]: value,
      };
    }
    return row;
  });
};

export const updateTableRow = (rowIndex, value) => (old) => {
  return old.map((row, index) => {
    if (index === rowIndex) {
      return {
        ...old[rowIndex],
        ...value,
      };
    }
    return row;
  });
};
export const transformGeneralSettings = (data) => {
  return _.mapKeys(data, (value, key) => _.snakeCase(key));
};

export const calculateStatus = (paymentAmount, balanceAmount) => {
  return _.round(paymentAmount / balanceAmount, 2);
};

const getCurrenciesOptions = () => {
  return Object.keys(Currencies).map((currencyCode) => {
    const currency = Currencies[currencyCode];

    return {
      ...currency,
      currency_code: currencyCode,
      formatted_name: `${currencyCode} - ${currency.name}`,
    };
  });
};

export const currenciesOptions = getCurrenciesOptions();

/**
 * Deeply get a value from an object via its path.
 */
function getIn(obj, key, def, p = 0) {
  const path = _.toPath(key);
  while (obj && p < path.length) {
    obj = obj[path[p++]];
  }
  return obj === undefined ? def : obj;
}

export const defaultFastFieldShouldUpdate = (props, prevProps) => {
  return (
    props.name !== prevProps.name ||
    getIn(props.formik.values, prevProps.name) !==
      getIn(prevProps.formik.values, prevProps.name) ||
    getIn(props.formik.errors, prevProps.name) !==
      getIn(prevProps.formik.errors, prevProps.name) ||
    getIn(props.formik.touched, prevProps.name) !==
      getIn(prevProps.formik.touched, prevProps.name) ||
    Object.keys(prevProps).length !== Object.keys(props).length ||
    props.formik.isSubmitting !== prevProps.formik.isSubmitting
  );
};

export const ensureEntriesHasEmptyLine = R.curry(
  (minLinesNumber, defaultEntry, entries) => {
    if (entries.length >= minLinesNumber) {
      return [...entries, defaultEntry];
    }
    return entries;
  },
);

export const transfromViewsToTabs = (views) => {
  return views.map((view) => ({ ..._.pick(view, ['slug', 'name']) }));
};

export function nestedArrayToFlatten(
  collection,
  property = 'children',
  parseItem = (a, level) => a,
  level = 1,
) {
  const parseObject = (obj) =>
    parseItem(
      {
        ..._.omit(obj, [property]),
        level,
      },
      level,
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
        level + 1,
      );
      localItems = _.concat(localItems, flattenArray);
    }
    return localItems;
  }, []);
}

export function getFieldsFromResourceMeta(resourceFields) {
  const fields = Object.keys(resourceFields)
    .map((fieldKey) => {
      const field = resourceFields[fieldKey];
      return {
        ...transformToCamelCase(field),
        key: fieldKey,
      };
    })
    .filter((field) => field.filterable !== false);

  return _.orderBy(fields, ['label']);
}

export function getFilterableFieldsFromFields(fields) {
  return fields.filter((field) => field.filterable !== false);
}

export const RESOURCE_TYPE = {
  ACCOUNTS: 'account',
  ITEMS: 'items',
};

function escapeRegExpChars(text) {
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

export function highlightText(text, query) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

function isBuffer(obj) {
  return (
    obj &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj)
  );
}

function keyIdentity(key) {
  return key;
}

export function flatten(opts, target) {
  opts = opts || {};

  const delimiter = opts.delimiter || '.';
  const maxDepth = opts.maxDepth;
  const transformKey = opts.transformKey || keyIdentity;
  const output = {};

  function step(object, prev, currentDepth) {
    currentDepth = currentDepth || 1;
    Object.keys(object).forEach(function (key) {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isbuffer = isBuffer(value);
      const isobject = type === '[object Object]' || type === '[object Array]';

      const newKey = prev
        ? prev + delimiter + transformKey(key)
        : transformKey(key);

      if (
        !isarray &&
        !isbuffer &&
        isobject &&
        Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)
      ) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
    });
  }

  step(target);

  return output;
}

/**
 * Ignores the given selectors from event callback.
 */
export function ignoreEventFromSelectors(event, selectors) {
  return selectors
    .map((selector) => event.target.closest(selector))
    .some((element) => !!element);
}

export const tableRowTypesToClassnames = ({ original }) => {
  const rowTypes = _.castArray(original.row_types);
  const rowId = original.id;

  const rowTypesClsx = rowTypes.filter((t) => t).map((t) => `row_type--${t}`);
  const rowIdClsx = `row-id--${original.id}`;

  return clsx(rowTypesClsx, { [`${rowIdClsx}`]: rowId });
};

/**
 * Filters the given accounts of the given query.
 * @param {*} accounts
 * @param {*} queryProps
 * @returns {*}
 */
export const filterAccountsByQuery = (accounts, queryProps) => {
  const defaultQuery = {
    filterByParentTypes: [],
    filterByTypes: [],
    filterByNormal: [],
    filterByRootTypes: [],
    ...pickBy(queryProps, (v) => v !== undefined),
  };
  const query = {
    filterByParentTypes: castArray(defaultQuery.filterByParentTypes),
    filterByTypes: castArray(defaultQuery.filterByTypes),
    filterByNormal: castArray(defaultQuery.filterByNormal),
    filterByRootTypes: castArray(defaultQuery.filterByRootTypes),
  };
  let filteredAccounts = [...accounts];

  if (!isEmpty(query.filterByParentTypes)) {
    filteredAccounts = filteredAccounts.filter((account) =>
      includes(query.filterByParentTypes, account.account_parent_type),
    );
  }
  if (!isEmpty(query.filterByTypes)) {
    filteredAccounts = filteredAccounts.filter((account) =>
      includes(query.filterByTypes, account.account_type),
    );
  }
  if (!isEmpty(query.filterByNormal)) {
    filteredAccounts = filteredAccounts.filter((account) =>
      includes(query.filterByTypes, account.account_normal),
    );
  }
  if (!isEmpty(query.filterByRootTypes)) {
    filteredAccounts = filteredAccounts.filter((account) =>
      includes(query.filterByRootTypes, account.account_root_type),
    );
  }
  return filteredAccounts;
};
