import React from 'react';
import { Formik, Field, FieldArray, useFormikContext } from 'formik';
import {
  Button,
  Intent,
  FormGroup,
  Classes,
  HTMLSelect,
} from '@blueprintjs/core';
import { get, defaultTo, isEqual } from 'lodash';
import { Icon, FormattedMessage as T } from 'components';
import {
  AdvancedFilterDropdownProvider,
  FilterConditionProvider,
  useFilterCondition,
  useAdvancedFilterContext,
} from './AdvancedFilterDropdownContext';
import AdvancedFilterCompatatorField from './AdvancedFilterCompatatorField';
import AdvancedFilterValueField from './AdvancedFilterValueField2';
import {
  filterConditionRoles,
  getConditionalsOptions,
  transformFieldsToOptions,
} from './utils';
import { getFilterDropdownSchema } from './AdvancedFilter.schema';
import {
  IAdvancedFilterDropdown,
  IAdvancedFilterDropdownFooter,
  IFilterDropdownFormikValues,
  IAdvancedFilterDropdownConditionsProps,
  IAdvancedFilterDropdownCondition,
  IFilterRole,
} from './interfaces';
import { useAdvancedFilterAutoSubmit } from './components';

/**
 * Filter condition field.
 */
function FilterConditionField() {
  const conditionalsOptions = getConditionalsOptions();
  const { conditionIndex } = useFilterCondition();

  return (
    <Field name={`conditions[${conditionIndex}].condition`}>
      {({ field }) => (
        <FormGroup className={'form-group--condition'}>
          <HTMLSelect
            options={conditionalsOptions}
            className={Classes.FILL}
            {...field}
          />
        </FormGroup>
      )}
    </Field>
  );
}

/**
 * Compatator field.
 */
function FilterCompatatorFilter() {
  const { conditionIndex } = useFilterCondition();

  return (
    <Field name={`conditions[${conditionIndex}].comparator`}>
      {({ field }) => (
        <FormGroup className={'form-group--comparator'}>
          <AdvancedFilterCompatatorField
            className={Classes.FILL}
            dataType={'text'}
            {...field}
          />
        </FormGroup>
      )}
    </Field>
  );
}

/**
 * Resource fields field.
 */
function FilterFieldsField() {
  const { conditionIndex } = useFilterCondition();
  const { fields } = useAdvancedFilterContext();

  return (
    <Field name={`conditions[${conditionIndex}].fieldKey`}>
      {({ field }) => (
        <FormGroup className={'form-group--fieldKey'}>
          <HTMLSelect
            options={transformFieldsToOptions(fields)}
            value={1}
            className={Classes.FILL}
            {...field}
          />
        </FormGroup>
      )}
    </Field>
  );
}

/**
 * Advanced filter value field.
 */
function FilterValueField(): JSX.Element | null {
  const { values } = useFormikContext();
  const { conditionIndex } = useFilterCondition();
  const { fieldsByKey } = useAdvancedFilterContext();

  // Current condition field key.
  const conditionFieldKey = get(
    values.conditions,
    `[${conditionIndex}].fieldKey`,
  );
  // Field meta.
  const fieldMeta = fieldsByKey[conditionFieldKey];

  // Can't continue if the given field key is not selected yet.
  if (!conditionFieldKey || !fieldMeta) {
    return null;
  }
  // Field meta type, name and options.
  const fieldType = get(fieldMeta, 'fieldType');
  const fieldName = get(fieldMeta, 'name');
  const options = get(fieldMeta, 'options');

  const valueFieldPath = `conditions[${conditionIndex}].value`;

  return (
    <Field name={valueFieldPath}>
      {({ form: { setFieldValue } }) => (
        <FormGroup className={'form-group--value'}>
          <AdvancedFilterValueField
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
    </Field>
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
        <FilterCompatatorFilter />
        <FilterFieldsField />
        <FilterValueField />

        <Button
          icon={<Icon icon="times" iconSize={14} />}
          minimal={true}
          onClick={handleClickRemoveCondition}
        />
      </FilterConditionProvider>
    </div>
  );
}

/**
 * Advanced filter dropdown condition.
 */
function AdvancedFilterDropdownConditions({
  push,
  remove,
  form,
}: IAdvancedFilterDropdownConditionsProps) {
  const { initialCondition } = useAdvancedFilterContext();

  // Handle remove condition.
  const handleClickRemoveCondition = (conditionIndex: number) => {
    remove(conditionIndex);
  };
  // Handle new condition button click.
  const handleNewConditionBtnClick = (index: number) => {
    push({ ...initialCondition });
  };

  return (
    <div className="filter-dropdonw__conditions-wrap">
      <div className={'filter-dropdown__conditions'}>
        {form.values.conditions.map((condition: IFilterRole, index: number) => (
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
  //
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
function AdvancedFilterDropdownFooter({
  onClick,
}: IAdvancedFilterDropdownFooter) {
  // Handle new filter condition button click.
  const onClickNewFilter = (event) => {
    onClick && onClick(event);
  };

  return (
    <div className="filter-dropdown__footer">
      <Button minimal={true} intent={Intent.PRIMARY} onClick={onClickNewFilter}>
        <T id={'new_conditional'} />
      </Button>
    </div>
  );
}

/**
 * Advanced filter dropdown.
 */
export default function AdvancedFilterDropdown({
  fields,
  defaultFieldKey,
  defaultComparator,
  defaultValue,
  onFilterChange,
}: IAdvancedFilterDropdown) {
  const [prevConditions, setPrevConditions] = React.useState({});

  // Handle the filter dropdown form submit.
  const handleFitlerDropdownSubmit = (values: IFilterDropdownFormikValues) => {
    const conditions = filterConditionRoles(values.conditions);

    // Campare the current conditions with previous conditions, if they were equal
    // there is no need to execute `onFilterChange` function.
    if (!isEqual(prevConditions, conditions) && conditions.length > 0) {
      onFilterChange && onFilterChange(conditions);

      setPrevConditions(conditions);
    }
  };

  // Filter dropdown validation schema.
  const validationSchema = getFilterDropdownSchema();

  // Initial condition.
  const initialCondition = {
    fieldKey: defaultFieldKey,
    comparator: defaultTo(defaultComparator, 'equals'),
    condition: '',
    value: defaultTo(defaultValue, ''),
  };
  // Initial values.
  const initialValues: IFilterDropdownFormikValues = {
    conditions: [initialCondition],
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
