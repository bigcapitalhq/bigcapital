// @flow
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import {
  FormGroup,
  Classes,
  HTMLSelect,
  Button,
  Intent,
} from '@blueprintjs/core';
import { useFormik } from 'formik';
import { isEqual, last } from 'lodash';
import { usePrevious } from 'react-use';
import Icon from 'components/Icon';
import { checkRequiredProperties, uniqueMultiProps } from 'utils';
import { FormattedMessage as T, useIntl } from 'react-intl';
import {
  DynamicFilterValueField,
  DynamicFilterCompatatorField,
} from 'components';
import Toaster from 'components/AppToaster';
import moment from 'moment';
import {
  getConditionTypeCompatators,
  getConditionDefaultCompatator,
} from './DynamicFilter/DynamicFilterCompatators';

let limitToast;

type InitialCondition = {
  fieldKey: string,
  comparator: string,
  value: string,
};

/**
 * Filter popover content.
 */
export default function FilterDropdown({
  fields,
  onFilterChange,
  initialCondition,
  initialConditions,
}) {
  const { formatMessage } = useIntl();

  // Fields key -> metadata table.
  const fieldsKeyMapped = useMemo(() =>
    new Map(fields.map((field) => [field.key, field])),
    [fields]
  );
  // Conditions options.
  const conditionalsOptions = useMemo(
    () => [
      { value: '&&', label: formatMessage({ id: 'and' }) },
      { value: '||', label: formatMessage({ id: 'or' }) },
    ],
    [formatMessage],
  );
  // Resources fileds options for fields options.
  const resourceFieldsOptions = useMemo(
    () => [
      ...fields.map((field) => ({
        value: field.key,
        label: field.label,
      })),
    ],
    [fields],
  );
  // Default filter conition.
  const defaultFilterCondition = useMemo(
    () => ({
      condition: '&&',
      fieldKey: initialCondition.fieldKey,
      comparator: initialCondition.comparator,
      value: initialCondition.value,
    }),
    [initialCondition],
  );
  // Formik for validation purposes.
  const { setFieldValue, getFieldProps, values } = useFormik({
    initialValues: {
      conditions: [
        ...((initialConditions && initialConditions.length) ?
          [...initialConditions] : [defaultFilterCondition]),
      ],
    },
  });

  // Handle click a new filter row.
  const onClickNewFilter = useCallback(() => {
    if (values.conditions.length >= 12) {
      limitToast = Toaster.show(
        {
          message: formatMessage({ id: 'you_reached_conditions_limit' }),
          intent: Intent.WARNING,
        },
        limitToast,
      );
    } else {
      setFieldValue('conditions', [
        ...values.conditions,
        defaultFilterCondition
      ]);
    }
  }, [values, setFieldValue, formatMessage, defaultFilterCondition]);

  // Filtered conditions that filters conditions that don't contain atleast 
  // on required fields or fileds keys that not exists. 
  const filteredFilterConditions = useMemo(() => {
    const requiredProps = ['fieldKey', 'condition', 'comparator', 'value'];

    const conditions = values.conditions
      .filter(
        (condition) => !checkRequiredProperties(condition, requiredProps),
      )
      .filter(
        (condition) => !!fieldsKeyMapped.get(condition.fieldKey),
      );
    return uniqueMultiProps(conditions, requiredProps);
  }, [values.conditions, fieldsKeyMapped]);

  // Previous filtered conditions.
  const prevConditions = usePrevious(filteredFilterConditions);

  useEffect(() => {
    // Campare the current conditions with previous conditions, if they were equal 
    // there is no need to execute `onFilterChange` function.
    if (!isEqual(prevConditions, filteredFilterConditions) && prevConditions) {
      onFilterChange && onFilterChange(filteredFilterConditions);
    }
  }, [filteredFilterConditions, prevConditions, onFilterChange]);

  // Handle click remove condition.
  const onClickRemoveCondition = (index) => () => {
    if (values.conditions.length === 1) {
      setFieldValue('conditions', [defaultFilterCondition]);
      return;
    }
    const conditions = [...values.conditions];
    conditions.splice(index, 1);
    setFieldValue('conditions', [...conditions]);
  };

  // Transform dynamic value field.
  const transformValueField = (value) => {
    if (value instanceof Date) {
      return moment(value).format('YYYY-MM-DD');
    } else if (typeof value === 'object') {
      return value.id;
    }
    return value;
  };
  // Override getFieldProps for conditions fields.
  const fieldProps = (name, index) => {
    const override = {
      ...getFieldProps(`conditions[${index}].${name}`),
    };
    return {
      ...override,
      onChange: (e) => {
        if (name === 'fieldKey') {
          const currentField = fieldsKeyMapped.get(
            values.conditions[index].fieldKey,
          );
          const nextField = fieldsKeyMapped.get(e.currentTarget.value);

          if (currentField.field_type !== nextField.field_type) {
            setFieldValue(`conditions[${index}].value`, '');
          }
          const comparatorsObs = getConditionTypeCompatators(
            nextField.field_type,
          );
          const currentCompatator = values.conditions[index].comparator;

          if (
            !currentCompatator ||
            comparatorsObs.map((c) => c.value).indexOf(currentCompatator) === -1
          ) {
            const defaultCompatator = getConditionDefaultCompatator(
              nextField.field_type,
            );
            setFieldValue(
              `conditions[${index}].comparator`,
              defaultCompatator.value,
            );
          }
        }
        override.onChange(e);
      },
    };
  };

  // Compatator field props.
  const comparatorFieldProps = (name, index) => {
    const condition = values.conditions[index];
    const field = fieldsKeyMapped.get(condition.fieldKey);

    return {
      ...fieldProps(name, index),
      dataType: field.field_type,
    };
  };

  // Value field props.
  const valueFieldProps = (name, index) => {
    const condition = values.conditions[index];
    const field = fieldsKeyMapped.get(condition.fieldKey);

    return {
      ...fieldProps(name, index),
      fieldName: field.label,
      fieldType: field.field_type,
      options: field.options,
      optionsResource: field.options_resource,
      onChange: (value) => {
        const transformedValue = transformValueField(value);
        setFieldValue(`conditions[${index}].${name}`, transformedValue);
      },
    };
  };

  return (
    <div class="filter-dropdown">
      <div class="filter-dropdown__body">
        {values.conditions.map((condition, index) => (
          <div class="filter-dropdown__condition">
            <FormGroup className={'form-group--condition'}>
              <HTMLSelect
                options={conditionalsOptions}
                className={Classes.FILL}
                disabled={index > 1}
                {...fieldProps('condition', index)}
              />
            </FormGroup>

            <FormGroup className={'form-group--field'}>
              <HTMLSelect
                options={resourceFieldsOptions}
                value={1}
                className={Classes.FILL}
                {...fieldProps('fieldKey', index)}
              />
            </FormGroup>

            <FormGroup className={'form-group--comparator'}>
              <DynamicFilterCompatatorField
                className={Classes.FILL}
                {...comparatorFieldProps('comparator', index)}
              />
            </FormGroup>

            <DynamicFilterValueField
              {...valueFieldProps('value', index)} />

            <Button
              icon={<Icon icon="times" iconSize={14} />}
              minimal={true}
              onClick={onClickRemoveCondition(index)}
            />
          </div>
        ))}
      </div>

      <div class="filter-dropdown__footer">
        <Button
          minimal={true}
          intent={Intent.PRIMARY}
          onClick={onClickNewFilter}
        >
          <T id={'new_conditional'} />
        </Button>
      </div>
    </div>
  );
}
