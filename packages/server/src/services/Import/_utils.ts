import * as Yup from 'yup';
import moment from 'moment';
import * as R from 'ramda';
import { Knex } from 'knex';
import fs from 'fs/promises';
import path from 'path';
import {
  defaultTo,
  upperFirst,
  camelCase,
  first,
  isUndefined,
  pickBy,
  isEmpty,
  castArray,
  get,
  head,
  split,
  last,
} from 'lodash';
import pluralize from 'pluralize';
import { ResourceMetaFieldsMap } from './interfaces';
import { IModelMetaField, IModelMetaField2 } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import { multiNumberParse } from '@/utils/multi-number-parse';

export const ERRORS = {
  RESOURCE_NOT_IMPORTABLE: 'RESOURCE_NOT_IMPORTABLE',
  INVALID_MAP_ATTRS: 'INVALID_MAP_ATTRS',
  DUPLICATED_FROM_MAP_ATTR: 'DUPLICATED_FROM_MAP_ATTR',
  DUPLICATED_TO_MAP_ATTR: 'DUPLICATED_TO_MAP_ATTR',
  IMPORT_FILE_NOT_MAPPED: 'IMPORT_FILE_NOT_MAPPED',
  INVALID_MAP_DATE_FORMAT: 'INVALID_MAP_DATE_FORMAT',
  MAP_DATE_FORMAT_NOT_DEFINED: 'MAP_DATE_FORMAT_NOT_DEFINED',
  IMPORTED_SHEET_EMPTY: 'IMPORTED_SHEET_EMPTY',
};

/**
 * Trimms the imported object string values before parsing.
 * @param {Record<string, string | number>} obj
 * @returns {<Record<string, string | number>}
 */
export function trimObject(obj: Record<string, string | number>) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Trim the key
    const trimmedKey = key.trim();

    // Trim the value if it's a string, otherwise leave it as is
    const trimmedValue = typeof value === 'string' ? value.trim() : value;

    // Assign the trimmed key and value to the accumulator object
    return { ...acc, [trimmedKey]: trimmedValue };
  }, {});
}

/**
 * Generates the Yup validation schema based on the given resource fields.
 * @param {ResourceMetaFieldsMap} fields
 * @returns {Yup}
 */
export const convertFieldsToYupValidation = (fields: ResourceMetaFieldsMap) => {
  const yupSchema = {};

  Object.keys(fields).forEach((fieldName: string) => {
    const field = fields[fieldName] as IModelMetaField;
    let fieldSchema;
    fieldSchema = Yup.string().label(field.name);

    if (field.fieldType === 'text') {
      if (!isUndefined(field.minLength)) {
        fieldSchema = fieldSchema.min(
          field.minLength,
          `Minimum length is ${field.minLength} characters`
        );
      }
      if (!isUndefined(field.maxLength)) {
        fieldSchema = fieldSchema.max(
          field.maxLength,
          `Maximum length is ${field.maxLength} characters`
        );
      }
    } else if (field.fieldType === 'number') {
      fieldSchema = Yup.number().label(field.name);

      if (!isUndefined(field.max)) {
        fieldSchema = fieldSchema.max(field.max);
      }
      if (!isUndefined(field.min)) {
        fieldSchema = fieldSchema.min(field.min);
      }
    } else if (field.fieldType === 'boolean') {
      fieldSchema = Yup.boolean().label(field.name);
    } else if (field.fieldType === 'enumeration') {
      const options = field.options.reduce((acc, option) => {
        acc[option.key] = option.label;
        return acc;
      }, {});
      fieldSchema = Yup.string().oneOf(Object.keys(options)).label(field.name);
      // Validate date field type.
    } else if (field.fieldType === 'date') {
      fieldSchema = fieldSchema.test(
        'date validation',
        'Invalid date or format. The string should be a valid YYYY-MM-DD format.',
        (val) => {
          if (!val) {
            return true;
          }
          return moment(val, 'YYYY-MM-DD', true).isValid();
        }
      );
    } else if (field.fieldType === 'url') {
      fieldSchema = fieldSchema.url();
    } else if (field.fieldType === 'collection') {
      const nestedFieldShema = convertFieldsToYupValidation(field.fields);
      fieldSchema = Yup.array().label(field.name);

      if (!isUndefined(field.collectionMaxLength)) {
        fieldSchema = fieldSchema.max(field.collectionMaxLength);
      }
      if (!isUndefined(field.collectionMinLength)) {
        fieldSchema = fieldSchema.min(field.collectionMinLength);
      }
      fieldSchema = fieldSchema.of(nestedFieldShema);
    }
    if (field.required) {
      fieldSchema = fieldSchema.required();
    }
    const _fieldName = parseFieldName(fieldName, field);

    yupSchema[_fieldName] = fieldSchema;
  });
  return Yup.object().shape(yupSchema);
};

const parseFieldName = (fieldName: string, field: IModelMetaField) => {
  let _key = fieldName;

  if (field.dataTransferObjectKey) {
    _key = field.dataTransferObjectKey;
  }
  return _key;
};

/**
 * Retrieves the unmapped sheet columns.
 * @param columns
 * @param mapping
 * @returns
 */
export const getUnmappedSheetColumns = (columns, mapping) => {
  return columns.filter(
    (column) => !mapping.some((map) => map.from === column)
  );
};

export const sanitizeResourceName = (resourceName: string) => {
  return upperFirst(camelCase(pluralize.singular(resourceName)));
};

export const getSheetColumns = (sheetData: unknown[]) => {
  return Object.keys(first(sheetData));
};

/**
 * Retrieves the unique value from the given imported object DTO based on the
 * configured unique resource field.
 * @param {{ [key: string]: IModelMetaField }} importableFields -
 * @param {<Record<string, any>}
 * @returns {string}
 */
export const getUniqueImportableValue = (
  importableFields: { [key: string]: IModelMetaField2 },
  objectDTO: Record<string, any>
) => {
  const uniqueImportableValue = pickBy(
    importableFields,
    (field) => field.unique
  );
  const uniqueImportableKeys = Object.keys(uniqueImportableValue);
  const uniqueImportableKey = first(uniqueImportableKeys);

  return defaultTo(objectDTO[uniqueImportableKey], '');
};

/**
 * Throws service error the given sheet is empty.
 * @param {Array<any>} sheetData
 */
export const validateSheetEmpty = (sheetData: Array<any>) => {
  if (isEmpty(sheetData)) {
    throw new ServiceError(ERRORS.IMPORTED_SHEET_EMPTY);
  }
};

const booleanValuesRepresentingTrue: string[] = ['true', 'yes', 'y', 't', '1'];
const booleanValuesRepresentingFalse: string[] = ['false', 'no', 'n', 'f', '0'];

/**
 * Parses the given string value to boolean.
 * @param {string} value
 * @returns {string|null}
 */
export const parseBoolean = (value: string): boolean | null => {
  const normalizeValue = (value: string): string =>
    value.toString().trim().toLowerCase();

  const normalizedValue = normalizeValue(value);
  const valuesRepresentingTrue =
    booleanValuesRepresentingTrue.map(normalizeValue);
  const valueRepresentingFalse =
    booleanValuesRepresentingFalse.map(normalizeValue);

  if (valuesRepresentingTrue.includes(normalizedValue)) {
    return true;
  } else if (valueRepresentingFalse.includes(normalizedValue)) {
    return false;
  }
  return null;
};

export const transformInputToGroupedFields = (input) => {
  const output = [];

  // Group for non-nested fields
  const mainGroup = {
    groupLabel: '',
    groupKey: '',
    fields: [],
  };
  input.forEach((item) => {
    if (!item.fields) {
      // If the item does not have nested fields, add it to the main group
      mainGroup.fields.push(item);
    } else {
      // If the item has nested fields, create a new group for these fields
      output.push({
        groupLabel: item.name,
        groupKey: item.key,
        fields: item.fields,
      });
    }
  });
  // Add the main group to the output if it contains any fields
  if (mainGroup.fields.length > 0) {
    output.unshift(mainGroup); // Add the main group at the beginning
  }
  return output;
};

export const getResourceColumns = (resourceColumns: {
  [key: string]: IModelMetaField2;
}) => {
  const mapColumn =
    (group: string) =>
    ([fieldKey, { name, importHint, required, order, ...field }]: [
      string,
      IModelMetaField2
    ]) => {
      const extra: Record<string, any> = {};
      const key = fieldKey;

      if (group) {
        extra.group = group;
      }
      if (field.fieldType === 'collection') {
        extra.fields = mapColumns(field.fields, key);
      }
      return {
        key,
        name,
        required,
        hint: importHint,
        order,
        ...extra,
      };
    };
  const sortColumn = (a, b) =>
    a.order && b.order ? a.order - b.order : a.order ? -1 : b.order ? 1 : 0;

  const mapColumns = (columns, parentKey = '') =>
    Object.entries(columns).map(mapColumn(parentKey)).sort(sortColumn);

  return R.compose(transformInputToGroupedFields, mapColumns)(resourceColumns);
};

// Prases the given object value based on the field key type.
export const valueParser =
  (fields: ResourceMetaFieldsMap, tenantModels: any, trx?: Knex.Transaction) =>
  async (value: any, key: string, group = '') => {
    let _value = value;

    const fieldKey = key.includes('.') ? key.split('.')[0] : key;
    const field = group ? fields[group]?.fields[fieldKey] : fields[fieldKey];

    // Parses the boolean value.
    if (field.fieldType === 'boolean') {
      _value = parseBoolean(value);

      // Parses the enumeration value.
    } else if (field.fieldType === 'enumeration') {
      const option = get(field, 'options', []).find(
        (option) => option.label === value
      );
      _value = get(option, 'key');
      // Parses the numeric value.
    } else if (field.fieldType === 'number') {
      _value = multiNumberParse(value);
      // Parses the relation value.
    } else if (field.fieldType === 'relation') {
      const RelationModel = tenantModels[field.relationModel];

      if (!RelationModel) {
        throw new Error(`The relation model of ${key} field is not exist.`);
      }
      const relationQuery = RelationModel.query(trx);
      const relationKeys = castArray(field?.relationImportMatch);

      relationQuery.where(function () {
        relationKeys.forEach((relationKey: string) => {
          this.orWhereRaw('LOWER(??) = LOWER(?)', [relationKey, value]);
        });
      });
      const result = await relationQuery.first();
      _value = get(result, 'id');
    } else if (field.fieldType === 'collection') {
      const ObjectFieldKey = key.includes('.') ? key.split('.')[1] : key;
      const _valueParser = valueParser(fields, tenantModels);
      _value = await _valueParser(value, ObjectFieldKey, fieldKey);
    }
    return _value;
  };

/**
 * Parses the field key and detarmines the key path.
 * @param {{ [key: string]: IModelMetaField2 }} fields
 * @param {string} key - Mapped key path. formats: `group.key` or `key`.
 * @returns {string}
 */
export const parseKey = R.curry(
  (fields: { [key: string]: IModelMetaField2 }, key: string) => {
    const fieldKey = getFieldKey(key);
    const field = fields[fieldKey];
    let _key = key;

    if (field.fieldType === 'collection') {
      if (field.collectionOf === 'object') {
        const nestedFieldKey = last(key.split('.'));
        _key = `${fieldKey}[0].${nestedFieldKey}`;
      } else if (
        field.collectionOf === 'string' ||
        field.collectionOf ||
        'numberic'
      ) {
        _key = `${fieldKey}`;
      }
    }
    return _key;
  }
);

/**
 * Retrieves the field root key, for instance: I -> entries.itemId O -> entries.
 * @param {string} input
 * @returns {string}
 */
export const getFieldKey = (input: string) => {
  const keys = split(input, '.');
  const firstKey = head(keys).split('[')[0]; // Split by "[" in case of array notation
  return firstKey;
};

/**
{ * Aggregates the input array of objects based on a comparator attribute and groups the entries.
 * This function is useful for combining multiple entries into a single entry based on a specific attribute,
 * while aggregating other attributes into an array.}
 *
 * @param {Array} input - The array of objects to be aggregated.
 * @param {string} comparatorAttr - The attribute of the objects used for comparison to aggregate.
 * @param {string} groupOn - The attribute of the objects where the grouped entries will be pushed.
 * @returns {Array} - The aggregated array of objects.
 *
 * @example
 * // Example input:
 * const input = [
 *   { id: 1, name: 'John', entries: ['entry1'] },
 *   { id: 2, name: 'Jane', entries: ['entry2'] },
 *   { id: 1, name: 'John', entries: ['entry3'] },
 * ];
 * const comparatorAttr = 'id';
 * const groupOn = 'entries';
 *
 * // Example output:
 * const output = [
 *   { id: 1, name: 'John', entries: ['entry1', 'entry3'] },
 *   { id: 2, name: 'Jane', entries: ['entry2'] },
 * ];
 */
export function aggregate(
  input: Array<any>,
  comparatorAttr: string,
  groupOn: string
): Array<Record<string, any>> {
  return input.reduce((acc, curr) => {
    const existingEntry = acc.find(
      (entry) => entry[comparatorAttr] === curr[comparatorAttr]
    );

    if (existingEntry) {
      existingEntry[groupOn].push(...curr.entries);
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);
}

/**
 * Sanitizes the data in the imported sheet by trimming object keys.
 * @param json - The JSON data representing the imported sheet.
 * @returns {string[][]} - The sanitized data with trimmed object keys.
 */
export const sanitizeSheetData = (json) => {
  return R.compose(R.map(trimObject))(json);
};

/**
 * Returns the path to map a value to based on the 'to' and 'group' parameters.
 * @param {string} to - The target key to map the value to.
 * @param {string} group - The group key to nest the target key under.
 * @returns {string} - The path to map the value to.
 */
export const getMapToPath = (to: string, group = '') =>
  group ? `${group}.${to}` : to;

export const getImportsStoragePath = () => {
  return  path.join(global.__storage_dir, `/imports`);
}

/**
 * Deletes the imported file from the storage and database.
 * @param {string} filename
 */
export const deleteImportFile = async (filename: string) => {
  const filePath = getImportsStoragePath();

  // Deletes the imported file.
  await fs.unlink(`${filePath}/${filename}`);
};

/**
 * Reads the import file.
 * @param {string} filename
 * @returns {Promise<Buffer>}
 */
export const readImportFile = (filename: string) => {
  const filePath = getImportsStoragePath();

  return fs.readFile(`${filePath}/${filename}`);
};
