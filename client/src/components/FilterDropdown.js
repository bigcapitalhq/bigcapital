// @flow 
import React, { useEffect, useMemo, useCallback, useRef } from 'react';
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
import { debounce } from 'lodash';
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
  getConditionDefaultCompatator
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
  refetchDebounceWait = 10,
  initialCondition,
}) {
  const { formatMessage } = useIntl();
  const fieldsKeyMapped = new Map(fields.map((field) => [field.key, field]));

  const conditionalsItems = useMemo(
    () => [
      { value: 'and', label: formatMessage({ id: 'and' }) },
      { value: 'or', label: formatMessage({ id: 'or' }) },
    ],
    [formatMessage],
  );

  const resourceFields = useMemo(
    () => [
      ...fields.map((field) => ({
        value: field.key,
        label: field.label_name,
      })),
    ],
    [fields],
  );

  const defaultFilterCondition = useMemo(
    () => ({
      condition: 'and',
      field_key: initialCondition.fieldKey,
      comparator: initialCondition.comparator,
      value: initialCondition.value,
    }),
    [fields],
  );

  const { setFieldValue, getFieldProps, values } = useFormik({
    enableReinitialize: true,
    initialValues: {
      conditions: [defaultFilterCondition],
    },
  });

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
        last(values.conditions),
      ]);
    }
  }, [values, defaultFilterCondition, setFieldValue]);

  const filteredFilterConditions = useMemo(() => {
    const requiredProps = ['field_key', 'condition', 'comparator', 'value'];
    const conditions = values.conditions.filter(
      (condition) => !checkRequiredProperties(condition, requiredProps),
    );
    return uniqueMultiProps(conditions, requiredProps);
  }, [values.conditions]);

  const prevConditions = usePrevious(filteredFilterConditions);

  const onFilterChangeThrottled = useRef(
    debounce((conditions) => {
      onFilterChange && onFilterChange(conditions);
    }, refetchDebounceWait),
  );

  useEffect(() => {
    if (!isEqual(prevConditions, filteredFilterConditions) && prevConditions) {
      onFilterChange && onFilterChange(filteredFilterConditions);
    }
  }, [filteredFilterConditions, prevConditions]);

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
        if (name === 'field_key') {
          const currentField = fieldsKeyMapped.get(
            values.conditions[index].field_key,
          );
          const nextField = fieldsKeyMapped.get(e.currentTarget.value);

          if (currentField.data_type !== nextField.data_type) {
            setFieldValue(`conditions[${index}].value`, '');
          }
          const comparatorsObs = getConditionTypeCompatators(nextField.data_type);
          const currentCompatator = values.conditions[index].comparator;

          if (!currentCompatator || comparatorsObs.map(c => c.value).indexOf(currentCompatator) === -1) {
            const defaultCompatator = getConditionDefaultCompatator(nextField.data_type);
            setFieldValue(`conditions[${index}].comparator`, defaultCompatator.value);
          }
        }
        override.onChange(e);
      },
    };
  };

  // Compatator field props.
  const comparatorFieldProps = (name, index) => {
    const condition = values.conditions[index];
    const field = fieldsKeyMapped.get(condition.field_key);

    return {
      ...fieldProps(name, index),
      dataType: field.data_type,
    };
  };

  // Value field props.
  const valueFieldProps = (name, index) => {
    const condition = values.conditions[index];
    const field = fieldsKeyMapped.get(condition.field_key);

    return {
      ...fieldProps(name, index),
      dataType: field.data_type,
      resourceKey: field.resource_key,
      options: field.options,
      dataResource: field.data_resource,
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
                options={conditionalsItems}
                className={Classes.FILL}
                disabled={index > 1}
                {...fieldProps('condition', index)}
              />
            </FormGroup>

            <FormGroup className={'form-group--field'}>
              <HTMLSelect
                options={resourceFields}
                value={1}
                className={Classes.FILL}
                {...fieldProps('field_key', index)}
              />
            </FormGroup>

            <FormGroup className={'form-group--comparator'}>
              <DynamicFilterCompatatorField
                className={Classes.FILL}
                {...comparatorFieldProps('comparator', index)}
              />
            </FormGroup>

            <DynamicFilterValueField {...valueFieldProps('value', index)} />

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
