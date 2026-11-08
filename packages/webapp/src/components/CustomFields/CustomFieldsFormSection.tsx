import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { getCustomFieldFormKey, useCustomFieldsDefinitions } from './utils';
import type { CustomField } from '@bigcapital/sdk-ts';
import {
  FCheckbox,
  FDateInput,
  FFormGroup,
  FInputGroup,
  FMultiSelect,
  FNumericInput,
  FSelect,
  FTextArea,
  FieldRequiredHint,
} from '@/components';
import { useDateInputFormatter } from '@/hooks';

interface CustomFieldsFormSectionProps {
  resource: string;
  title?: React.ReactNode;
  className?: string;
}

export function CustomFieldsFormSection({
  resource,
  title,
}: CustomFieldsFormSectionProps) {
  const { fields } = useCustomFieldsDefinitions(resource);
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();
  const appliedDefaults = React.useRef(false);

  React.useEffect(() => {
    if (appliedDefaults.current || fields.length === 0) {
      return;
    }
    appliedDefaults.current = true;

    fields.forEach((field) => {
      if (field.defaultValue === null || field.defaultValue === undefined) {
        return;
      }
      const key = getCustomFieldFormKey(field.fieldName);
      const current = values?.customFields?.[key];
      if (current === undefined || current === null || current === '') {
        setFieldValue(`customFields.${key}`, field.defaultValue);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  if (fields.length === 0) {
    return null;
  }

  return (
    <div className={'custom-fields-form-section'}>
      {title ? (
        <h4 className={'custom-fields-form-section__title'}>{title}</h4>
      ) : null}
      {fields.map((field) => (
        <CustomFieldFormGroup key={field.id} field={field} />
      ))}
    </div>
  );
}

function CustomFieldFormGroup({ field }: { field: CustomField }) {
  const key = getCustomFieldFormKey(field.fieldName);
  const name = `customFields.${key}`;

  return (
    <FFormGroup
      name={name}
      label={field.label}
      labelInfo={field.required ? <FieldRequiredHint /> : undefined}
      helperText={field.helpText || undefined}
      inline={true}
      fastField={true}
    >
      <CustomFieldInput field={field} name={name} />
    </FFormGroup>
  );
}

function CustomFieldInput({
  field,
  name,
}: {
  field: CustomField;
  name: string;
}) {
  const dateInputFormatter = useDateInputFormatter();

  switch (field.dataType) {
    case 'textarea':
      return <FTextArea name={name} fill={true} fastField={true} />;

    case 'number':
    case 'decimal':
      return (
        <FNumericInput
          name={name}
          min={field.minValue ?? undefined}
          max={field.maxValue ?? undefined}
          fill={true}
          fastField={true}
        />
      );

    case 'date':
      return (
        <FDateInput
          name={name}
          {...dateInputFormatter}
          fill={true}
          fastField={true}
        />
      );

    case 'checkbox':
      return (
        <FCheckbox
          name={name}
          label={field.placeholder || field.label}
          fastField={true}
        />
      );

    case 'dropdown':
      return (
        <FSelect
          name={name}
          items={(field.options ?? []).map((option) => ({
            value: option,
            label: option,
          }))}
          valueAccessor={'value'}
          textAccessor={'label'}
          placeholder={field.placeholder || undefined}
          popoverProps={{ minimal: true }}
          fill={true}
          fastField={true}
        />
      );

    case 'multiselect': {
      const items = (field.options ?? []).map((option) => ({
        value: option,
        label: option,
      }));

      return (
        <FMultiSelect<{ value: string; label: string }>
          name={name}
          items={items}
          valueAccessor={'value'}
          labelAccessor={'label'}
          tagAccessor={'label'}
          itemRenderer={(item, { handleClick, modifiers }, { isSelected }) => (
            <div
              key={item.value}
              className={modifiers.active ? 'bp4-menu-item-active' : ''}
              onClick={handleClick}
              style={{ padding: '6px 10px', cursor: 'pointer' }}
            >
              {isSelected ? '✓ ' : ''}
              {item.label}
            </div>
          )}
          fill={true}
          fastField={true}
        />
      );
    }

    case 'email':
      return (
        <FInputGroup
          name={name}
          type={'email'}
          placeholder={field.placeholder || undefined}
          fill={true}
          fastField={true}
        />
      );

    case 'url':
      return (
        <FInputGroup
          name={name}
          type={'url'}
          placeholder={field.placeholder || undefined}
          fill={true}
          fastField={true}
        />
      );

    case 'phone':
      return (
        <FInputGroup
          name={name}
          type={'tel'}
          placeholder={field.placeholder || undefined}
          fill={true}
          fastField={true}
        />
      );

    case 'text':
    default:
      return (
        <FInputGroup
          name={name}
          placeholder={field.placeholder || field.label}
          fill={true}
          fastField={true}
        />
      );
  }
}

export const customFieldsSectionTitle = () =>
  intl.get('custom_fields.form.section_title');
