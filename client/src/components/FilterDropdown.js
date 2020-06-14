import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import {
  FormGroup,
  Classes,
  HTMLSelect,
  Button,
  Intent,
} from '@blueprintjs/core';
import { useFormik } from 'formik';
import { isEqual } from 'lodash';
import { usePrevious } from 'react-use';
import { debounce } from 'lodash';
import Icon from 'components/Icon';
import { checkRequiredProperties } from 'utils';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { DynamicFilterValueField } from 'components';
import Toaster from 'components/AppToaster';
import moment from 'moment';

let limitToast;

/**
 * Filter popover content.
 */
export default function FilterDropdown({
  fields,
  onFilterChange,
  refetchDebounceWait = 250,
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
  const compatatorsItems = useMemo(
    () => [
      { value: '', label: formatMessage({ id: 'comparator' }) },
      { value: 'equals', label: formatMessage({ id: 'equals' }) },
      { value: 'not_equal', label: formatMessage({ id: 'not_equal' }) },
      { value: 'contain', label: formatMessage({ id: 'contain' }) },
      { value: 'not_contain', label: formatMessage({ id: 'not_contain' }) },
    ],
    [formatMessage],
  );

  const defaultFilterCondition = useMemo(
    () => ({
      condition: 'and',
      field_key: fields.length > 0 ? fields[0].key : '',
      compatator: 'equals',
      value: '',
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
        defaultFilterCondition,
      ]);
    }
  }, [values, defaultFilterCondition, setFieldValue]);

  const filteredFilterConditions = useMemo(() => {
    const requiredProps = ['field_key', 'condition', 'compatator', 'value'];

    return values.conditions.filter(
      (condition) => !checkRequiredProperties(condition, requiredProps),
    );
  }, [values.conditions]);

  const prevConditions = usePrevious(filteredFilterConditions);

  const onFilterChangeThrottled = useRef(
    debounce((conditions) => {
      onFilterChange && onFilterChange(conditions);
    }, refetchDebounceWait),
  );

  useEffect(() => {
    if (!isEqual(prevConditions, filteredFilterConditions) && prevConditions) {
      onFilterChangeThrottled.current(filteredFilterConditions);
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

  // transform dynamic value field.
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
          const prevField = fieldsKeyMapped.get(e.currentTarget.value);

          if (currentField.data_type !== prevField.data_type) {
            setFieldValue(`conditions[${index}].value`, '');
          }
        }
        override.onChange(e);
      },
    };
  };

  // Value field props.
  const valueFieldProps = (name, index) => ({
    ...fieldProps(name, index),
    onChange: (value) => {
      const transformedValue = transformValueField(value);
      setFieldValue(`conditions[${index}].${name}`, transformedValue);
    },
  });

  console.log(values.conditions, 'XX');

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

            <FormGroup className={'form-group--compatator'}>
              <HTMLSelect
                options={compatatorsItems}
                className={Classes.FILL}
                {...fieldProps('compatator', index)}
              />
            </FormGroup>

            <DynamicFilterValueField
              fieldMeta={fieldsKeyMapped.get(condition.field_key)}
              {...valueFieldProps('value', index)}
            />
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
