import moment from 'moment';
import _ from 'lodash';
import { Intent } from '@blueprintjs/core';
import Currency from 'js-money/lib/currency';
import PProgress from 'p-progress';
import accounting from 'accounting';
import deepMapKeys from 'deep-map-keys';
 

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
    (a, b) => (...args) => a(b(...args)),
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

export function formattedAmount(cents, currency) {
  const { symbol, decimal_digits: precision } = Currency[currency];
  return accounting.formatMoney(cents, { symbol, precision });
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

export const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

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
    const oper = new PProgress((resolve, reject, progress) => {
      actionCb(formData, file, (requestProgress) => {
        progress(requestProgress);
      })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
    opers.push(oper);
  });
  return PProgress.all(opers);
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
  return _.isEmpty(value) && !_.isNumber(value) || _.isNaN(value);
}

export const getColumnWidth = (
  rows,
  accessor,
  { maxWidth, minWidth, magicSpacing = 14 },
) => {
  const cellLength = Math.max(
    ...rows.map((row) => (`${_.get(row, accessor)}` || '').length),
  );
  let result = cellLength * magicSpacing;

  result = minWidth ? Math.max(minWidth, result) : result;
  result = maxWidth ? Math.min(maxWidth, result) : result;

  return result;
};

export const toSafeNumber = (number) => {
  return _.toNumber(_.defaultTo(number, 0));
};

export const transformToCamelCase = (object) => {
  return deepMapKeys(object, (key) => _.snakeCase(key));
};


export function flatObject(obj) {
  const flatObject = {};
  const path = []; // current path

  function dig(obj) {
      if (obj !== Object(obj))
          /*is primitive, end of path*/
          return flatObject[path.join('.')] = obj; /*<- value*/ 
  
      //no? so this is an object with keys. go deeper on each key down
      for (let key in obj) {
          path.push(key);
          dig(obj[key]);
          path.pop();
      }
  }

  dig(obj);
  return flatObject;
}