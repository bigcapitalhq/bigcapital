import * as Yup from 'yup';
import { upperFirst, camelCase, first } from 'lodash';
import pluralize from 'pluralize';
import { ResourceMetaFieldsMap } from './interfaces';
import { IModelMetaField } from '@/interfaces';
import moment from 'moment';

export const ERRORS = {
  RESOURCE_NOT_IMPORTABLE: 'RESOURCE_NOT_IMPORTABLE',
  INVALID_MAP_ATTRS: 'INVALID_MAP_ATTRS',
  DUPLICATED_FROM_MAP_ATTR: 'DUPLICATED_FROM_MAP_ATTR',
  DUPLICATED_TO_MAP_ATTR: 'DUPLICATED_TO_MAP_ATTR',
  IMPORT_FILE_NOT_MAPPED: 'IMPORT_FILE_NOT_MAPPED',
  INVALID_MAP_DATE_FORMAT: 'INVALID_MAP_DATE_FORMAT',
  MAP_DATE_FORMAT_NOT_DEFINED: 'MAP_DATE_FORMAT_NOT_DEFINED',
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
      if (field.minLength) {
        fieldSchema = fieldSchema.min(
          field.minLength,
          `Minimum length is ${field.minLength} characters`
        );
      }
      if (field.maxLength) {
        fieldSchema = fieldSchema.max(
          field.maxLength,
          `Maximum length is ${field.maxLength} characters`
        );
      }
    } else if (field.fieldType === 'number') {
      fieldSchema = Yup.number().label(field.name);
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
    }
    if (field.required) {
      fieldSchema = fieldSchema.required();
    }
    yupSchema[fieldName] = fieldSchema;
  });
  return Yup.object().shape(yupSchema);
};

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
