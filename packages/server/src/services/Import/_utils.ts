import { ServiceError } from '@/exceptions';
import { IModelMetaField } from '@/interfaces';
import { camelCase, defaultTo, first, isEmpty, isUndefined, pickBy, upperFirst } from 'lodash';
import moment from 'moment';
import pluralize from 'pluralize';
import * as Yup from 'yup';
import { ResourceMetaFieldsMap } from './interfaces';

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

export function trimObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    // Trim the key
    const trimmedKey = key.trim();

    // Trim the value if it's a string, otherwise leave it as is
    const trimmedValue = typeof value === 'string' ? value.trim() : value;

    // Assign the trimmed key and value to the accumulator object
    return { ...acc, [trimmedKey]: trimmedValue };
  }, {});
}

export const convertFieldsToYupValidation = (fields: ResourceMetaFieldsMap) => {
  const yupSchema = {};
  Object.keys(fields).forEach((fieldName: string) => {
    const field = fields[fieldName] as IModelMetaField;
    let fieldSchema;
    fieldSchema = Yup.string().label(field.name);

    if (field.fieldType === 'text') {
      if (!isUndefined(field.minLength)) {
        fieldSchema = fieldSchema.min(field.minLength, `Minimum length is ${field.minLength} characters`);
      }
      if (!isUndefined(field.maxLength)) {
        fieldSchema = fieldSchema.max(field.maxLength, `Maximum length is ${field.maxLength} characters`);
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
        },
      );
    } else if (field.fieldType === 'url') {
      fieldSchema = fieldSchema.url();
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

  if (field.fieldType === 'relation') {
    _key = `${fieldName}Id`;
  }
  if (field.dataTransferObjectKey) {
    _key = field.dataTransferObjectKey;
  }
  return _key;
};

export const getUnmappedSheetColumns = (columns, mapping) => {
  return columns.filter((column) => !mapping.some((map) => map.from === column));
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
  importableFields: { [key: string]: IModelMetaField },
  objectDTO: Record<string, any>,
) => {
  const uniqueImportableValue = pickBy(importableFields, (field) => field.unique);
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
  const normalizeValue = (value: string): string => value.toString().trim().toLowerCase();

  const normalizedValue = normalizeValue(value);
  const valuesRepresentingTrue = booleanValuesRepresentingTrue.map(normalizeValue);
  const valueRepresentingFalse = booleanValuesRepresentingFalse.map(normalizeValue);

  if (valuesRepresentingTrue.includes(normalizedValue)) {
    return true;
  } else if (valueRepresentingFalse.includes(normalizedValue)) {
    return false;
  }
  return null;
};
