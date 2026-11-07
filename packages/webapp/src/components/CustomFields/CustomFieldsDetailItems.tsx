import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import {
  getCustomFieldFormKey,
  getCustomFieldValue,
  useCustomFieldsDefinitions,
} from './utils';
import type { CustomField } from '@bigcapital/sdk-ts';
import { DetailItem } from '@/components';

interface CustomFieldsDetailItemsProps {
  resource: string;
  values?: Record<string, unknown> | null;
}

export function CustomFieldsDetailItems({
  resource,
  values,
}: CustomFieldsDetailItemsProps) {
  const { fields } = useCustomFieldsDefinitions(resource);

  if (!values || fields.length === 0) {
    return null;
  }
  const visibleFields = fields.filter((field) => {
    const value = getCustomFieldValue(values, field.fieldName);
    return value !== null && value !== undefined && value !== '';
  });

  if (visibleFields.length === 0) {
    return null;
  }

  return (
    <>
      {visibleFields.map((field) => (
        <DetailItem key={field.id} label={field.label}>
          {formatCustomFieldValue(
            field,
            getCustomFieldValue(values, field.fieldName),
          )}
        </DetailItem>
      ))}
    </>
  );
}

function formatCustomFieldValue(field: CustomField, value: unknown) {
  if (field.dataType === 'checkbox') {
    return value ? intl.get('yes') : intl.get('no');
  }
  if (field.dataType === 'date') {
    return value ? moment(value as string).format('YYYY-MM-DD') : '';
  }
  if (field.dataType === 'multiselect') {
    return Array.isArray(value) ? value.join(', ') : '';
  }
  if (field.dataType === 'url' && value) {
    return (
      <a href={String(value)} target={'_blank'} rel={'noreferrer'}>
        {String(value)}
      </a>
    );
  }
  if (field.dataType === 'email' && value) {
    return <a href={`mailto:${String(value)}`}>{String(value)}</a>;
  }
  if (field.dataType === 'textarea') {
    return <span style={{ whiteSpace: 'pre-wrap' }}>{String(value)}</span>;
  }
  return <span>{String(value)}</span>;
}

export const getCustomFieldDetailKey = getCustomFieldFormKey;
