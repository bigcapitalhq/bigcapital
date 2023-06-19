// @ts-nocheck
import React from 'react';
import { Formik, FastField, FieldArray, useFormikContext } from 'formik';
import {
  Button,
  FormGroup,
  Classes,
  InputGroup,
  MenuItem,
} from '@blueprintjs/core';
import { get, first, defaultTo, isEqual, isEmpty } from 'lodash';
import intl from 'react-intl-universal';
import { Choose, Icon, FormattedMessage as T, ListSelect } from '@/components';
import { useUpdateEffect } from '@/hooks';
import {
  AdvancedFilterDropdownProvider,
  FilterConditionProvider,
  useFilterCondition,
  useAdvancedFilterContext,
} from './AdvancedFilterDropdownContext';
import AdvancedFilterComparatorField from './AdvancedFilterComparatorField';
import AdvancedFilterValueField from './AdvancedFilterValueField';
import {
  filterConditionRoles,
  getConditionalsOptions,
  transformFieldsToOptions,
  shouldFilterValueFieldUpdate,
  getConditionTypeComparators,
} from './utils';
import { getFilterDropdownSchema } from './AdvancedFilter.schema';
import { useAdvancedFilterAutoSubmit } from './components';

/**
 * Condition item list renderer.
 */
function ConditionItemRenderer(condition, { handleClick, modifiers, query }) {
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
function FilterConditionField() {
  const conditionalsOptions = getConditionalsOptions();
  const { conditionIndex, getConditionFieldPath } = useFilterCondition();

  const conditionFieldPath = getConditionFieldPath('condition');

  return (
    <FastField name={conditionFieldPath}>
      {({ form, field }) => (
        <FormGroup className={'form-group--condition'}>
          <Choose>
            <Choose.When condition={conditionIndex === 0}>
              <InputGroup disabled value={intl.get('filter.when')} />
            </Choose.When>

            <Choose.Otherwise>
              <ListSelect
                selectedItem={field.value}
                textProp={'label'}
                selectedItemProp={'value'}
                labelProp={'text'}
                items={conditionalsOptions}
                className={Classes.FILL}
                filterable={false}
                onItemSelect={(option) => {
                  form.setFieldValue(conditionFieldPath, option.value);
                }}
                popoverProps={{
                  inline: true,
                  minimal: true,
                  captureDismiss: true,
                }}
                itemRenderer={ConditionItemRenderer}
              />
            </Choose.Otherwise>
          </Choose>
        </FormGroup>
      )}
    </FastField>
  );
}

/**
 * Comparator field.
 */
function FilterComparatorFilter() {
  const { getConditionFieldPath, fieldMeta } = useFilterCondition();

  const comparatorFieldPath = getConditionFieldPath('comparator');
  const fieldType = get(fieldMeta, 'fieldType');

  return (
    <FastField name={comparatorFieldPath}>
      {({ form, field }) => (
        <FormGroup className={'form-group--comparator'}>
          <AdvancedFilterComparatorField
            dataType={fieldType}
            className={Classes.FILL}
            selectedItem={field.value}
            onItemSelect={(option) => {
              form.setFieldValue(comparatorFieldPath, option.value);
            }}
          />
        </FormGroup>
      )}
    </FastField>
  );
}

/**
 * Changes default value of comparator field in the condition row once the
 * field option changing.
 */
function useDefaultComparatorFieldValue({
  getConditionValue,
  setConditionValue,
  fieldMeta,
}) {
  const fieldKeyValue = getConditionValue('fieldKey');

  const comparatorsOptions = React.useMemo(
    () => getConditionTypeComparators(fieldMeta.fieldType),
    [fieldMeta.fieldType],
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
function FilterFieldsField() {
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
      {({ field, form }) => (
        <FormGroup className={'form-group--fieldKey'}>
          <ListSelect
            selectedItem={field.value}
            textProp={'label'}
            selectedItemProp={'value'}
            items={transformFieldsToOptions(fields)}
            className={Classes.FILL}
            onItemSelect={(option) => {
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
        </FormGroup>
      )}
    </FastField>
  );
}

/**
 * Advanced filter value field.
 */
function FilterValueField() {
  const { conditionIndex, fieldMeta, getConditionFieldPath } =
    useFilterCondition();

  // Can't continue if the given field key is not selected yet.
  if (!fieldMeta) {
    return null;
  }
  // Field meta type, name and options.
  const fieldType = get(fieldMeta, 'fieldType');
  const fieldName = get(fieldMeta, 'name');
  const options = get(fieldMeta, 'options');

  const valueFieldPath = getConditionFieldPath('value');

  return (
    <FastField
      name={valueFieldPath}
      fieldKey={fieldType} // Pass to shouldUpdate function.
      shouldUpdate={shouldFilterValueFieldUpdate}
    >
      {({ form: { setFieldValue }, field }) => (
        <FormGroup className={'form-group--value'}>
          <AdvancedFilterValueField
            isFocus={conditionIndex === 0}
            value={field.value}
            key={'name'}
            label={fieldName}
            fieldType={fieldType}
            options={options}
            onChange={(value) => {
              setFieldValue(valueFieldPath, value);
            }}
          />
        </FormGroup>
      )}
    </FastField>
  );
}

/**
 * Advanced filter condition line.
 */
function AdvancedFilterDropdownCondition({ conditionIndex, onRemoveClick }) {
  // Handle click remove condition.
  const handleClickRemoveCondition = () => {
    onRemoveClick && onRemoveClick(conditionIndex);
  };

  return (
    <div className="filter-dropdown__condition">
      <FilterConditionProvider conditionIndex={conditionIndex}>
        <FilterConditionField />
        <FilterFieldsField />
        <FilterComparatorFilter />
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
function AdvancedFilterDropdownConditions({ push, remove, replace, form }) {
  const { initialCondition } = useAdvancedFilterContext();

  // Handle remove condition.
  const handleClickRemoveCondition = (conditionIndex) => {
    if (form.values.conditions.length > 1) {
      remove(conditionIndex);
    } else {
      replace(0, { ...initialCondition });
    }
  };
  // Handle new condition button click.
  const handleNewConditionBtnClick = (index) => {
    push({ ...initialCondition });
  };

  return (
    <div className="filter-dropdonw__conditions-wrap">
      <div className={'filter-dropdown__conditions'}>
        {form.values.conditions.map((condition, index) => (
          <AdvancedFilterDropdownCondition
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
function AdvancedFilterDropdownForm() {
  // Advanced filter auto-save.
  useAdvancedFilterAutoSubmit();

  return (
    <div className="filter-dropdown__form">
      <FieldArray
        name={'conditions'}
        render={({ ...fieldArrayProps }) => (
          <AdvancedFilterDropdownConditions {...fieldArrayProps} />
        )}
      />
    </div>
  );
}

/**
 * Advanced filter dropdown footer.
 */
function AdvancedFilterDropdownFooter({ onClick }) {
  // Handle new filter condition button click.
  const onClickNewFilter = (event) => {
    onClick && onClick(event);
  };
  return (
    <div className="filter-dropdown__footer">
      <Button minimal={true} onClick={onClickNewFilter}>
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
}) {
  // Initial condition.
  const initialCondition = {
    fieldKey: defaultFieldKey,
    comparator: defaultTo(defaultComparator, 'contain'),
    condition: defaultTo(defaultCondition, 'or'),
    value: defaultTo(defaultValue, ''),
  };
  // Initial conditions.
  const initialConditions = !isEmpty(conditions)
    ? conditions
    : [initialCondition, initialCondition];

  const [prevConditions, setPrevConditions] = React.useState(initialConditions);

  // Handle the filter dropdown form submit.
  const handleFitlerDropdownSubmit = (values) => {
    const conditions = filterConditionRoles(values.conditions);

    // Compare the current conditions with previous conditions, if they were equal
    // there is no need to execute `onFilterChange` function.
    if (!isEqual(prevConditions, conditions)) {
      onFilterChange && onFilterChange(conditions);
      setPrevConditions(conditions);
    }
  };
  // Filter dropdown validation schema.
  const validationSchema = getFilterDropdownSchema();

  // Initial values.
  const initialValues = {
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
