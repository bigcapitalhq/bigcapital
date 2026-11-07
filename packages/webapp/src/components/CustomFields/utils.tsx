import { camelCase, get } from 'lodash';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import type { CustomField } from '@bigcapital/sdk-ts';
import {
  CUSTOM_FIELD_NUMERIC_DATA_TYPES,
  CUSTOM_FIELD_TEXT_DATA_TYPES,
} from '@/constants/customFields';
import { useCustomFields } from '@/hooks/query';

export const getCustomFieldFormKey = (fieldName: string): string =>
  camelCase(fieldName);

export const getCustomFieldValue = (
  values: Record<string, unknown> | null | undefined,
  fieldName: string,
) => {
  if (!values) return undefined;
  const camelKey = camelCase(fieldName);
  return values[camelKey] ?? values[fieldName];
};

export const getCustomFieldsValues = (
  entity: { customFields?: Record<string, unknown> } | null | undefined,
) => entity?.customFields ?? {};

export const useCustomFieldsDefinitions = (resource: string) => {
  const { data, isLoading } = useCustomFields({
    resourceName: resource,
    includeInactive: false,
  });

  const fields = useMemo(() => (data?.data ?? []) as CustomField[], [data]);

  return { fields, isLoading };
};

export const useCustomFieldsValidationSchema = (resource: string) => {
  const { fields } = useCustomFieldsDefinitions(resource);

  return useMemo(() => {
    const shape: Record<string, any> = {};

    fields.forEach((field) => {
      const key = getCustomFieldFormKey(field.fieldName);
      let schema: any;

      if (CUSTOM_FIELD_NUMERIC_DATA_TYPES.includes(field.dataType)) {
        schema = Yup.number()
          .nullable()
          .transform((value, originalValue) =>
            originalValue === '' || originalValue === null ? null : value,
          );
        if (field.minValue !== null && field.minValue !== undefined) {
          schema = (schema as Yup.NumberSchema).min(Number(field.minValue));
        }
        if (field.maxValue !== null && field.maxValue !== undefined) {
          schema = (schema as Yup.NumberSchema).max(Number(field.maxValue));
        }
        if (field.dataType === 'number') {
          schema = (schema as Yup.NumberSchema).integer(
            intl.get('custom_fields.error.invalid'),
          );
        }
      } else if (field.dataType === 'date') {
        schema = Yup.date().nullable();
      } else if (field.dataType === 'checkbox') {
        schema = Yup.boolean().nullable();
      } else if (field.dataType === 'multiselect') {
        schema = Yup.array().of(Yup.string());
      } else if (field.dataType === 'dropdown') {
        schema = Yup.string().nullable();
        if (Array.isArray(field.options) && field.options.length > 0) {
          schema = (schema as Yup.StringSchema).oneOf([
            ...(field.options as string[]),
            null,
          ] as any);
        }
      } else {
        schema = Yup.string().nullable();
        if (CUSTOM_FIELD_TEXT_DATA_TYPES.includes(field.dataType)) {
          if (field.minLength !== null && field.minLength !== undefined) {
            schema = (schema as Yup.StringSchema).min(Number(field.minLength));
          }
          if (field.maxLength !== null && field.maxLength !== undefined) {
            schema = (schema as Yup.StringSchema).max(Number(field.maxLength));
          } else if (field.dataType === 'text') {
            schema = (schema as Yup.StringSchema).max(255);
          }
        }
        if (field.dataType === 'email') {
          schema = (schema as Yup.StringSchema).email(
            intl.get('custom_fields.error.invalid'),
          );
        }
        if (field.dataType === 'url') {
          schema = (schema as Yup.StringSchema).url(
            intl.get('custom_fields.error.invalid'),
          );
        }
      }
      if (field.required) {
        schema = schema.required(intl.get('custom_fields.error.required'));
      }
      shape[key] = schema;
    });

    return Yup.object().shape({
      customFields: Yup.object().shape(shape),
    });
  }, [fields]);
};

export const applyCustomFieldDefaults = (
  fields: CustomField[],
  values: Record<string, unknown>,
  setFieldValue: (name: string, value: unknown) => void,
) => {
  fields.forEach((field) => {
    if (field.defaultValue === null || field.defaultValue === undefined) {
      return;
    }
    const key = getCustomFieldFormKey(field.fieldName);
    const current = get(values, `customFields.${key}`);
    if (current === undefined || current === null || current === '') {
      setFieldValue(`customFields.${key}`, field.defaultValue);
    }
  });
};
