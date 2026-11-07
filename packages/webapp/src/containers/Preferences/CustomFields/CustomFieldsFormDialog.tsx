import { Button, Classes, Dialog, Intent, Tag } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import type { CustomField } from '@bigcapital/sdk-ts';
import {
  AppToaster,
  FCheckbox,
  FFormGroup,
  FInputGroup,
  FMultiSelect,
  FNumericInput,
  FSelect,
  FTextArea,
  FormattedMessage as T,
} from '@/components';
import {
  CUSTOM_FIELD_DATA_TYPES,
  CUSTOM_FIELD_NUMERIC_DATA_TYPES,
  CUSTOM_FIELD_OPTIONS_DATA_TYPES,
  CUSTOM_FIELD_TEXT_DATA_TYPES,
} from '@/constants/customFields';
import { useCreateCustomField, useEditCustomField } from '@/hooks/query';

interface CustomFieldsFormDialogProps {
  isOpen: boolean;
  resource: string;
  customField?: CustomField | null;
  onClose: () => void;
}

interface CustomFieldsFormValues {
  label: string;
  dataType: string;
  helpText: string;
  placeholder: string;
  defaultValue: unknown;
  required: boolean;
  unique: boolean;
  active: boolean;
  sortOrder: number | string;
  options: string[];
  inputFormat: string;
  minLength: number | string;
  maxLength: number | string;
  minValue: number | string;
  maxValue: number | string;
}

const DEFAULT_VALUES: CustomFieldsFormValues = {
  label: '',
  dataType: 'text',
  helpText: '',
  placeholder: '',
  defaultValue: '',
  required: false,
  unique: false,
  active: true,
  sortOrder: 0,
  options: [],
  inputFormat: '',
  minLength: '',
  maxLength: '',
  minValue: '',
  maxValue: '',
};

const getInitialValues = (
  customField?: CustomField | null,
): CustomFieldsFormValues => {
  if (!customField) {
    return { ...DEFAULT_VALUES };
  }
  return {
    label: customField.label ?? '',
    dataType: customField.dataType ?? 'text',
    helpText: customField.helpText ?? '',
    placeholder: customField.placeholder ?? '',
    defaultValue:
      customField.defaultValue === null ||
      customField.defaultValue === undefined
        ? ''
        : customField.defaultValue,
    required: Boolean(customField.required),
    unique: Boolean(customField.unique),
    active: Boolean(customField.active),
    sortOrder: customField.sortOrder ?? 0,
    options: Array.isArray(customField.options)
      ? (customField.options as string[])
      : [],
    inputFormat: customField.inputFormat ?? '',
    minLength: customField.minLength ?? '',
    maxLength: customField.maxLength ?? '',
    minValue: customField.minValue ?? '',
    maxValue: customField.maxValue ?? '',
  };
};

const normalizeOptionalNumber = (value: number | string) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const normalizeDefaultValue = (
  dataType: string,
  value: unknown,
  options: string[],
) => {
  if (dataType === 'checkbox') {
    return Boolean(value);
  }
  if (dataType === 'multiselect') {
    return Array.isArray(value) ? value : [];
  }
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  if (CUSTOM_FIELD_NUMERIC_DATA_TYPES.includes(dataType)) {
    return Number(value);
  }
  if (dataType === 'dropdown' && !options.includes(String(value))) {
    return undefined;
  }
  return String(value);
};

export function CustomFieldsFormDialog({
  isOpen,
  resource,
  customField,
  onClose,
}: CustomFieldsFormDialogProps) {
  const isEditMode = Boolean(customField);
  const { mutateAsync: createCustomField, isPending: isCreating } =
    useCreateCustomField();
  const { mutateAsync: editCustomField, isPending: isEditing } =
    useEditCustomField();

  const initialValues = React.useMemo(
    () => getInitialValues(customField),
    [customField],
  );

  const validationSchema = React.useMemo(
    () =>
      Yup.object().shape({
        label: Yup.string()
          .required(intl.get('custom_fields.error.required'))
          .max(255),
        dataType: Yup.string().required(),
        options: Yup.array().when('dataType', {
          is: (dataType: string) =>
            CUSTOM_FIELD_OPTIONS_DATA_TYPES.includes(dataType),
          then: (schema: any) =>
            schema
              .of(Yup.string().trim().required())
              .min(1, intl.get('custom_fields.form.options_required')),
        }),
        inputFormat: Yup.string().test(
          'valid-regex',
          intl.get('custom_fields.error.invalid'),
          (value) => {
            if (!value) return true;
            try {
              // eslint-disable-next-line no-new
              new RegExp(value);
              return true;
            } catch {
              return false;
            }
          },
        ),
      }),
    [],
  );

  const handleSubmit = (
    values: CustomFieldsFormValues,
    { setSubmitting }: FormikHelpers<CustomFieldsFormValues>,
  ) => {
    const options = CUSTOM_FIELD_OPTIONS_DATA_TYPES.includes(values.dataType)
      ? values.options.map((option) => option.trim()).filter(Boolean)
      : undefined;
    const payload = {
      label: values.label.trim(),
      dataType: values.dataType,
      helpText: values.helpText || undefined,
      placeholder: values.placeholder || undefined,
      defaultValue:
        normalizeDefaultValue(
          values.dataType,
          values.defaultValue,
          options ?? [],
        ) ?? null,
      required: Boolean(values.required),
      unique: Boolean(values.unique),
      active: Boolean(values.active),
      sortOrder: normalizeOptionalNumber(values.sortOrder) ?? 0,
      options,
      inputFormat: CUSTOM_FIELD_TEXT_DATA_TYPES.includes(values.dataType)
        ? values.inputFormat || undefined
        : undefined,
      minLength: CUSTOM_FIELD_TEXT_DATA_TYPES.includes(values.dataType)
        ? normalizeOptionalNumber(values.minLength)
        : undefined,
      maxLength: CUSTOM_FIELD_TEXT_DATA_TYPES.includes(values.dataType)
        ? normalizeOptionalNumber(values.maxLength)
        : undefined,
      minValue: CUSTOM_FIELD_NUMERIC_DATA_TYPES.includes(values.dataType)
        ? normalizeOptionalNumber(values.minValue)
        : undefined,
      maxValue: CUSTOM_FIELD_NUMERIC_DATA_TYPES.includes(values.dataType)
        ? normalizeOptionalNumber(values.maxValue)
        : undefined,
    };

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get(
          isEditMode
            ? 'custom_fields.message.updated'
            : 'custom_fields.message.created',
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
      onClose();
    };
    const onError = () => {
      AppToaster.show({
        message: intl.get('something_went_wrong'),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
    };

    if (isEditMode && customField) {
      editCustomField([customField.id, payload as any])
        .then(onSuccess)
        .catch(onError);
    } else {
      createCustomField({ resourceName: resource as any, ...payload } as any)
        .then(onSuccess)
        .catch(onError);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={intl.get(
        isEditMode ? 'custom_fields.dialog.edit' : 'custom_fields.dialog.new',
      )}
      className={'dialog--custom-field-form'}
      style={{ width: 620 }}
    >
      <Formik<CustomFieldsFormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div className={Classes.DIALOG_BODY}>
              <FFormGroup
                name={'label'}
                label={intl.get('custom_fields.field.label')}
                labelInfo={<span className={'text-danger'}>*</span>}
                inline={true}
                fastField
              >
                <FInputGroup name={'label'} fill={true} fastField />
              </FFormGroup>

              <FFormGroup
                name={'dataType'}
                label={intl.get('custom_fields.field.data_type')}
                inline={true}
                fastField
              >
                <FSelect
                  name={'dataType'}
                  items={CUSTOM_FIELD_DATA_TYPES.map((item) => ({
                    value: item.value,
                    label: intl.get(item.labelKey),
                  }))}
                  valueAccessor={'value'}
                  textAccessor={'label'}
                  disabled={isEditMode}
                  popoverProps={{ minimal: true }}
                  fill={true}
                  fastField
                />
              </FFormGroup>

              {isEditMode && customField ? (
                <FFormGroup
                  name={'fieldName'}
                  label={intl.get('custom_fields.column.api_name')}
                  inline={true}
                >
                  <Tag minimal={true}>{customField.fieldName}</Tag>
                </FFormGroup>
              ) : null}

              <FFormGroup
                name={'helpText'}
                label={intl.get('custom_fields.field.help_text')}
                inline={true}
                fastField
              >
                <FTextArea name={'helpText'} fill={true} fastField />
              </FFormGroup>

              <FFormGroup
                name={'placeholder'}
                label={intl.get('custom_fields.field.placeholder')}
                inline={true}
                fastField
              >
                <FInputGroup name={'placeholder'} fill={true} fastField />
              </FFormGroup>

              <DefaultValueField
                dataType={values.dataType}
                options={values.options}
              />

              {CUSTOM_FIELD_OPTIONS_DATA_TYPES.includes(values.dataType) ? (
                <FFormGroup
                  name={'options'}
                  label={intl.get('custom_fields.field.options')}
                  inline={true}
                >
                  <OptionsEditor
                    options={values.options}
                    onChange={(options) => setFieldValue('options', options)}
                  />
                </FFormGroup>
              ) : null}

              {CUSTOM_FIELD_TEXT_DATA_TYPES.includes(values.dataType) ? (
                <>
                  <FFormGroup
                    name={'inputFormat'}
                    label={intl.get('custom_fields.field.input_format')}
                    inline={true}
                    fastField
                  >
                    <FInputGroup name={'inputFormat'} fill={true} fastField />
                  </FFormGroup>
                  <FFormGroup
                    name={'minLength'}
                    label={intl.get('custom_fields.field.min_length')}
                    inline={true}
                  >
                    <FNumericInput
                      name={'minLength'}
                      min={0}
                      fill={true}
                      fastField
                    />
                  </FFormGroup>
                  <FFormGroup
                    name={'maxLength'}
                    label={intl.get('custom_fields.field.max_length')}
                    inline={true}
                  >
                    <FNumericInput
                      name={'maxLength'}
                      min={0}
                      fill={true}
                      fastField
                    />
                  </FFormGroup>
                </>
              ) : null}

              {CUSTOM_FIELD_NUMERIC_DATA_TYPES.includes(values.dataType) ? (
                <>
                  <FFormGroup
                    name={'minValue'}
                    label={intl.get('custom_fields.field.min_value')}
                    inline={true}
                  >
                    <FNumericInput name={'minValue'} fill={true} fastField />
                  </FFormGroup>
                  <FFormGroup
                    name={'maxValue'}
                    label={intl.get('custom_fields.field.max_value')}
                    inline={true}
                  >
                    <FNumericInput name={'maxValue'} fill={true} fastField />
                  </FFormGroup>
                </>
              ) : null}

              <FFormGroup
                name={'required'}
                label={intl.get('custom_fields.field.required')}
                inline={true}
              >
                <FCheckbox
                  name={'required'}
                  label={intl.get('custom_fields.form.required_hint')}
                  fastField
                />
              </FFormGroup>

              <FFormGroup
                name={'unique'}
                label={intl.get('custom_fields.field.unique')}
                inline={true}
              >
                <FCheckbox name={'unique'} label={''} fastField />
              </FFormGroup>

              <FFormGroup
                name={'sortOrder'}
                label={intl.get('custom_fields.field.sort_order')}
                inline={true}
              >
                <FNumericInput
                  name={'sortOrder'}
                  min={0}
                  fill={true}
                  fastField
                />
              </FFormGroup>

              <FFormGroup
                name={'active'}
                label={intl.get('custom_fields.field.active')}
                inline={true}
              >
                <FCheckbox name={'active'} label={''} fastField />
              </FFormGroup>
            </div>

            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button onClick={onClose}>
                  <T id={'cancel'} />
                </Button>
                <Button
                  intent={Intent.PRIMARY}
                  type={'submit'}
                  loading={isSubmitting || isCreating || isEditing}
                >
                  <T id={isEditMode ? 'update' : 'save'} />
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: string[];
  onChange: (options: string[]) => void;
}) {
  const handleChange = (index: number, value: string) => {
    const next = [...options];
    next[index] = value;
    onChange(next);
  };
  const handleRemove = (index: number) => {
    onChange(options.filter((_, optionIndex) => optionIndex !== index));
  };
  const handleAdd = () => {
    onChange([...options, '']);
  };
  return (
    <div style={{ flex: 1 }}>
      {options.map((option, index) => (
        <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            className={'bp4-input bp4-fill'}
            value={option}
            onChange={(event) => handleChange(index, event.target.value)}
          />
          <Button
            icon={'trash'}
            minimal={true}
            intent={Intent.DANGER}
            onClick={() => handleRemove(index)}
          />
        </div>
      ))}
      <Button
        icon={'plus'}
        minimal={true}
        intent={Intent.PRIMARY}
        text={intl.get('custom_fields.form.add_option')}
        onClick={handleAdd}
      />
    </div>
  );
}

function DefaultValueField({
  dataType,
  options,
}: {
  dataType: string;
  options: string[];
}) {
  if (dataType === 'checkbox') {
    return (
      <FFormGroup
        name={'defaultValue'}
        label={intl.get('custom_fields.field.default_value')}
        inline={true}
      >
        <FCheckbox name={'defaultValue'} label={' '} fastField />
      </FFormGroup>
    );
  }
  if (dataType === 'multiselect') {
    const items = options.filter(Boolean).map((option) => ({
      value: option,
      label: option,
    }));

    return (
      <FFormGroup
        name={'defaultValue'}
        label={intl.get('custom_fields.field.default_value')}
        inline={true}
      >
        <FMultiSelect<{ value: string; label: string }>
          name={'defaultValue'}
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
        />
      </FFormGroup>
    );
  }
  if (dataType === 'dropdown') {
    return (
      <FFormGroup
        name={'defaultValue'}
        label={intl.get('custom_fields.field.default_value')}
        inline={true}
      >
        <FSelect
          name={'defaultValue'}
          items={options.filter(Boolean).map((option) => ({
            value: option,
            label: option,
          }))}
          valueAccessor={'value'}
          textAccessor={'label'}
          popoverProps={{ minimal: true }}
          fill={true}
        />
      </FFormGroup>
    );
  }
  if (CUSTOM_FIELD_NUMERIC_DATA_TYPES.includes(dataType)) {
    return (
      <FFormGroup
        name={'defaultValue'}
        label={intl.get('custom_fields.field.default_value')}
        inline={true}
      >
        <FNumericInput name={'defaultValue'} fill={true} fastField />
      </FFormGroup>
    );
  }
  return (
    <FFormGroup
      name={'defaultValue'}
      label={intl.get('custom_fields.field.default_value')}
      inline={true}
    >
      <FInputGroup name={'defaultValue'} fill={true} fastField />
    </FFormGroup>
  );
}
