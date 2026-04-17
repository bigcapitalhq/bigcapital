// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useFormikContext } from 'formik';

import {
  FormattedMessage as T,
  FieldRequiredHint,
  Card,
  FFormGroup,
  FInputGroup,
  FSelect,
  FCheckbox,
  FSwitch,
  FNumericInput,
} from '@/components';
import { useAutofocus } from '@/hooks';
import { useCustomFieldsFormContext } from './CustomFieldsFormProvider';

const RESOURCE_OPTIONS = [
  { label: 'Sale Invoice', value: 'SaleInvoice' },
  { label: 'Sale Estimate', value: 'SaleEstimate' },
  { label: 'Sale Receipt', value: 'SaleReceipt' },
  { label: 'Customer', value: 'Customer' },
  { label: 'Item', value: 'Item' },
  { label: 'Credit Note', value: 'CreditNote' },
  { label: 'Payment Receive', value: 'PaymentReceive' },
];

const FIELD_TYPE_OPTIONS = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Dropdown', value: 'dropdown' },
  { label: 'URL', value: 'url' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Auto Number', value: 'autonumber' },
  { label: 'Lookup', value: 'lookup' },
  { label: 'Formula', value: 'formula' },
];

/**
 * Custom Fields form header.
 * @returns {React.JSX}
 */
export function CustomFieldsFormHeader() {
  const labelFieldRef = useAutofocus();
  const { values } = useFormikContext();
  const { isNewMode } = useCustomFieldsFormContext();
  const isDropdown = values.fieldType === 'dropdown';

  return (
    <Card>
      {/* ---------- Resource ----------  */}
      <FFormGroup
        name={'resourceName'}
        label={
          <strong>
            <T id={'custom_fields.label.resource'} />
          </strong>
        }
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FSelect
          name={'resourceName'}
          items={RESOURCE_OPTIONS}
          valueAccessor={'value'}
          textAccessor={'label'}
          placeholder={intl.get('select_an_item')}
          disabled={!isNewMode}
          popoverProps={{ minimal: true }}
          fastField
        />
      </FFormGroup>

      {/* ---------- Field Name ----------  */}
      <FFormGroup
        name={'fieldName'}
        label={
          <strong>
            <T id={'custom_fields.label.field_name'} />
          </strong>
        }
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FInputGroup
          name={'fieldName'}
          medium={true}
          inputRef={(ref) => (labelFieldRef.current = ref)}
          fill
          fastField
        />
      </FFormGroup>

      {/* ---------- Label ----------  */}
      <FFormGroup
        name={'label'}
        label={
          <strong>
            <T id={'custom_fields.label.label'} />
          </strong>
        }
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FInputGroup
          name={'label'}
          medium={true}
          fill
          fastField
        />
      </FFormGroup>

      {/* ---------- Field Type ----------  */}
      <FFormGroup
        name={'fieldType'}
        label={
          <strong>
            <T id={'custom_fields.label.type'} />
          </strong>
        }
        labelInfo={<FieldRequiredHint />}
        inline
        fastField
      >
        <FSelect
          name={'fieldType'}
          items={FIELD_TYPE_OPTIONS}
          valueAccessor={'value'}
          textAccessor={'label'}
          placeholder={intl.get('select_an_item')}
          popoverProps={{ minimal: true }}
          fastField
        />
      </FFormGroup>

      {/* ---------- Dropdown Options ----------  */}
      {isDropdown && (
        <DropdownOptionsField />
      )}

      {/* ---------- Default Value ----------  */}
      <FFormGroup
        name={'defaultValue'}
        label={<T id={'custom_fields.label.default_value'} />}
        inline
        fastField
      >
        <FInputGroup
          name={'defaultValue'}
          medium={true}
          fill
          fastField
        />
      </FFormGroup>

      {/* ---------- Required ----------  */}
      <FFormGroup
        name={'required'}
        label={<T id={'custom_fields.label.required'} />}
        inline
        fastField
      >
        <FCheckbox
          name={'required'}
          label={intl.get('custom_fields.required_description')}
          fastField
        />
      </FFormGroup>

      {/* ---------- Order ----------  */}
      <FFormGroup
        name={'order'}
        label={<T id={'custom_fields.label.order'} />}
        inline
        fastField
      >
        <FNumericInput
          name={'order'}
          min={0}
          fill
          fastField
        />
      </FFormGroup>

      {/* ---------- Active ----------  */}
      <FFormGroup
        name={'active'}
        label={<T id={'custom_fields.label.active'} />}
        inline
        fastField
      >
        <FSwitch
          name={'active'}
          label={intl.get('custom_fields.active_description')}
          fastField
        />
      </FFormGroup>
    </Card>
  );
}

/**
 * Dropdown options field.
 */
function DropdownOptionsField() {
  const { values, setFieldValue } = useFormikContext();
  const choices = values.options?.choices || [];

  const handleAddChoice = () => {
    const newChoices = [...choices, ''];
    setFieldValue('options', { ...values.options, choices: newChoices });
  };

  const handleRemoveChoice = (index) => {
    const newChoices = choices.filter((_, i) => i !== index);
    setFieldValue('options', { ...values.options, choices: newChoices });
  };

  const handleChangeChoice = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setFieldValue('options', { ...values.options, choices: newChoices });
  };

  return (
    <FFormGroup
      label={<strong><T id={'custom_fields.label.choices'} /></strong>}
      inline
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {choices.map((choice, index) => (
          <div key={index} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={choice}
              onChange={(e) => handleChangeChoice(index, e.target.value)}
              className="bp4-input bp4-fill"
              placeholder={intl.get('custom_fields.choice_placeholder')}
            />
            <button
              type="button"
              className="bp4-button bp4-intent-danger"
              onClick={() => handleRemoveChoice(index)}
            >
              {intl.get('remove')}
            </button>
          </div>
        ))}
        <button
          type="button"
          className="bp4-button bp4-intent-primary"
          onClick={handleAddChoice}
          style={{ alignSelf: 'flex-start' }}
        >
          {intl.get('custom_fields.add_choice')}
        </button>
      </div>
    </FFormGroup>
  );
}
