import { Button, Classes, InputGroup, MenuItem } from '@blueprintjs/core';
import { Formik, FastField, FieldArray, useFormikContext } from 'formik';
import { get, first, defaultTo, isEqual, isEmpty } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { getFilterDropdownSchema } from './AdvancedFilter.schema';
import AdvancedFilterCompatatorField from './AdvancedFilterCompatatorField';
import {
  AdvancedFilterDropdownProvider,
  FilterConditionProvider,
  useFilterCondition,
  useAdvancedFilterContext,
} from './AdvancedFilterDropdownContext';
import AdvancedFilterValueField from './AdvancedFilterValueField';
import { useAdvancedFilterAutoSubmit } from './components';
import {
  filterConditionRoles,
  getConditionalsOptions,
  getConditionTypeCompatators,
  transformFieldsToOptions,
  shouldFilterValueFieldUpdate,
} from './utils';
import type {
  IAdvancedFilterDropdown,
  IAdvancedFilterDropdownCondition,
  IAdvancedFilterDropdownConditionsProps,
  IAdvancedFilterDropdownFooter,
  IConditionOption,
  IFilterDropdownFormikValues,
  IFilterRole,
  IResourceField,
  IResourceFieldType,
} from './interfaces';
import type { FieldInputProps, FormikContextType, ArrayHelpers } from 'formik';
import {
  Choose,
  Icon,
  FormattedMessage as T,
  FSelect,
  FFormGroup,
} from '@/components';
import { useUpdateEffect } from '@/hooks';

type ConditionRenderHelpers = {
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  modifiers: { active: boolean; disabled: boolean };
  query: string;
};

/**
 * Condition item list renderer.
 */
function ConditionItemRenderer(
  condition: IConditionOption,
  { handleClick }: ConditionRenderHelpers,
) {
  return (
    <MenuItem
      text={
        <>
          <div>{condition.label}</div>
          <span className="text-hint">{condition.text}</span>
        </>
      }
      key={condition.value}
      onClick={handleClick}
    />
  );
}

/**
 * Filter condition field.
 */
function FilterConditionField(): JSX.Element {
  const conditionalsOptions = getConditionalsOptions();
  const { conditionIndex, getConditionFieldPath } = useFilterCondition();

  const conditionFieldPath = getConditionFieldPath('condition');

  return (
    <FFormGroup className={'form-group--condition'} name={conditionFieldPath}>
      <Choose>
        <Choose.When condition={conditionIndex === 0}>
          <InputGroup disabled value={intl.get('filter.when')} />
        </Choose.When>

        <Choose.Otherwise>
          <FSelect
            name={conditionFieldPath}
            textAccessor={'label'}
            valueAccessor={'value'}
            labelAccessor={'text'}
            items={conditionalsOptions}
            filterable={false}
            popoverProps={{
              inline: true,
              minimal: true,
              captureDismiss: true,
            }}
            itemRenderer={ConditionItemRenderer}
            className={Classes.FILL}
          />
        </Choose.Otherwise>
      </Choose>
    </FFormGroup>
  );
}

/**
 * Compatator field.
 */
function FilterCompatatorFilter(): JSX.Element {
  const { getConditionFieldPath, fieldMeta } = useFilterCondition();

  const comparatorFieldPath = getConditionFieldPath('comparator');
  const fieldType = fieldMeta?.fieldType;

  return (
    <FFormGroup
      name={comparatorFieldPath}
      className={'form-group--comparator'}
      fastField
    >
      <AdvancedFilterCompatatorField
        name={comparatorFieldPath}
        dataType={fieldType as IResourceFieldType}
        className={Classes.FILL}
        fastField
      />
    </FFormGroup>
  );
}

type DefaultComparatorHookArgs = {
  getConditionValue: (field: keyof IFilterRole) => unknown;
  setConditionValue: (field: keyof IFilterRole, value: unknown) => void;
  fieldMeta?: IResourceField;
};

/**
 * Changes default value of comparator field in the condition row once the
 * field option changing.
 */
function useDefaultComparatorFieldValue({
  getConditionValue,
  setConditionValue,
  fieldMeta,
}: DefaultComparatorHookArgs) {
  const fieldKeyValue = getConditionValue('fieldKey');

  const comparatorsOptions = React.useMemo(
    () => (fieldMeta ? getConditionTypeCompatators(fieldMeta.fieldType) : []),
    [fieldMeta],
  );

  useUpdateEffect(() => {
    if (fieldKeyValue) {
      const defaultValue = get(first(comparatorsOptions), 'value');
      setConditionValue('comparator', defaultValue);
    }
  }, [fieldKeyValue, setConditionValue, comparatorsOptions]);
}

/**
 * Resource fields field.
 */
function FilterFieldsField(): JSX.Element {
  const {
    getConditionFieldPath,
    getConditionValue,
    setConditionValue,
    fieldMeta,
  } = useFilterCondition();

  const { fields } = useAdvancedFilterContext();

  const fieldPath = getConditionFieldPath('fieldKey');
  const valueFieldPath = getConditionFieldPath('value');

  useDefaultComparatorFieldValue({
    getConditionValue,
    setConditionValue,
    fieldMeta,
  });

  return (
    <FastField name={fieldPath}>
      {({
        field,
        form,
      }: {
        field: FieldInputProps<IFilterRole['fieldKey']>;
        form: FormikContextType<IFilterDropdownFormikValues>;
      }) => (
        <FFormGroup className={'form-group--fieldKey'} name={fieldPath}>
          <FSelect
            name={fieldPath}
            selectedItem={field.value}
            textAccessor={'label'}
            valueAccessor={'value'}
            items={transformFieldsToOptions(fields)}
            className={Classes.FILL}
            onItemSelect={(option: IConditionOption) => {
              form.setFieldValue(fieldPath, option.value);

              // Resets the value field to empty once the field option changing.
              form.setFieldValue(valueFieldPath, '');
            }}
            popoverProps={{
              inline: true,
              minimal: true,
              captureDismiss: true,
            }}
          />
        </FFormGroup>
      )}
    </FastField>
  );
}

/**
 * Advanced filter value field.
 */
function FilterValueField(): JSX.Element | null {
  const { conditionIndex, fieldMeta, getConditionFieldPath } =
    useFilterCondition();

  // Can't continue if the given field key is not selected yet.
  if (!fieldMeta) {
    return null;
  }
  // Field meta type, name and options.
  const fieldType = fieldMeta.fieldType;
  const fieldName = fieldMeta.name;
  const options = fieldMeta.options;

  const valueFieldPath = getConditionFieldPath('value');

  return (
    <FastField
      name={valueFieldPath}
      fieldKey={fieldType} // Pass to shouldUpdate function.
      shouldUpdate={shouldFilterValueFieldUpdate}
    >
      {({
        form: { setFieldValue },
        field,
      }: {
        form: FormikContextType<IFilterDropdownFormikValues>;
        field: FieldInputProps<unknown>;
      }) => (
        <FFormGroup className={'form-group--value'} name={valueFieldPath}>
          <AdvancedFilterValueField
            isFocus={conditionIndex === 0}
            value={field.value as string | boolean | undefined}
            key={'name'}
            label={fieldName}
            fieldType={fieldType}
            options={options}
            onChange={(value) => {
              setFieldValue(valueFieldPath, value);
            }}
          />
        </FFormGroup>
      )}
    </FastField>
  );
}

/**
 * Advanced filter condition line.
 */
function AdvancedFilterDropdownCondition({
  conditionIndex,
  onRemoveClick,
}: IAdvancedFilterDropdownCondition) {
  // Handle click remove condition.
  const handleClickRemoveCondition = () => {
    onRemoveClick && onRemoveClick(conditionIndex);
  };

  return (
    <div className="filter-dropdown__condition">
      <FilterConditionProvider conditionIndex={conditionIndex}>
        <FilterConditionField />
        <FilterFieldsField />
        <FilterCompatatorFilter />
        <FilterValueField />

        <Button
          icon={<Icon icon="times" iconSize={14} />}
          minimal={true}
          onClick={handleClickRemoveCondition}
          className={'button--remove'}
        />
      </FilterConditionProvider>
    </div>
  );
}

/**
 * Advanced filter dropdown condition.
 */
function AdvancedFilterDropdownConditions(
  props: IAdvancedFilterDropdownConditionsProps,
): JSX.Element {
  const { push, remove, replace, form } = props;
  const { initialCondition } = useAdvancedFilterContext();

  // Handle remove condition.
  const handleClickRemoveCondition = (conditionIndex: number) => {
    if (form.values.conditions.length > 1) {
      remove(conditionIndex);
    } else {
      replace(0, { ...initialCondition });
    }
  };
  // Handle new condition button click.
  const handleNewConditionBtnClick = () => {
    push({ ...initialCondition });
  };

  return (
    <div className="filter-dropdonw__conditions-wrap">
      <div className={'filter-dropdown__conditions'}>
        {form.values.conditions.map((_condition, index) => (
          <AdvancedFilterDropdownCondition
            key={index}
            conditionIndex={index}
            onRemoveClick={handleClickRemoveCondition}
          />
        ))}
      </div>
      <AdvancedFilterDropdownFooter onClick={handleNewConditionBtnClick} />
    </div>
  );
}

/**
 * Advanced filter dropdown form.
 */
function AdvancedFilterDropdownForm(): JSX.Element {
  // Advanced filter auto-save.
  useAdvancedFilterAutoSubmit();
  const form = useFormikContext<IFilterDropdownFormikValues>();

  return (
    <div className="filter-dropdown__form">
      <FieldArray
        name={'conditions'}
        render={(arrayHelpers: ArrayHelpers) => (
          <AdvancedFilterDropdownConditions {...arrayHelpers} form={form} />
        )}
      />
    </div>
  );
}

/**
 * Advanced filter dropdown footer.
 */
function AdvancedFilterDropdownFooter({
  onClick,
}: IAdvancedFilterDropdownFooter): JSX.Element {
  return (
    <div className="filter-dropdown__footer">
      <Button minimal={true} onClick={onClick}>
        <T id={'new_conditional'} />
      </Button>
    </div>
  );
}

/**
 * Advanced filter dropdown.
 */
export function AdvancedFilterDropdown({
  fields,
  conditions,
  defaultFieldKey,
  defaultComparator,
  defaultValue,
  defaultCondition,
  onFilterChange,
}: IAdvancedFilterDropdown): JSX.Element {
  // Initial condition.
  const initialCondition: IFilterRole = {
    fieldKey: defaultFieldKey,
    comparator: defaultTo(defaultComparator, 'contain'),
    condition: defaultTo(defaultCondition, 'or'),
    value: defaultTo(defaultValue, ''),
  };
  // Initial conditions.
  const initialConditions: IFilterRole[] =
    conditions && !isEmpty(conditions)
      ? conditions
      : [initialCondition, initialCondition];

  const [prevConditions, setPrevConditions] = React.useState(initialConditions);

  // Handle the filter dropdown form submit.
  const handleFitlerDropdownSubmit = (values: IFilterDropdownFormikValues) => {
    const conditions = filterConditionRoles(values.conditions);

    // Campare the current conditions with previous conditions, if they were equal
    // there is no need to execute `onFilterChange` function.
    if (!isEqual(prevConditions, conditions)) {
      onFilterChange && onFilterChange(conditions);
      setPrevConditions(conditions);
    }
  };
  // Filter dropdown validation schema.
  const validationSchema = getFilterDropdownSchema();

  // Initial values.
  const initialValues: IFilterDropdownFormikValues = {
    conditions: initialConditions,
  };

  return (
    <div className="filter-dropdown">
      <AdvancedFilterDropdownProvider
        initialCondition={initialCondition}
        fields={fields}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          component={AdvancedFilterDropdownForm}
          onSubmit={handleFitlerDropdownSubmit}
        />
      </AdvancedFilterDropdownProvider>
    </div>
  );
}
