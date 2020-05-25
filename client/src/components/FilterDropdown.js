import React, {useEffect, useMemo, useCallback, useRef} from 'react';
import {
  FormGroup,
  InputGroup,
  Classes,
  HTMLSelect,
  Button,
  Intent,
} from "@blueprintjs/core"
import { useFormik } from 'formik';
import { isEqual } from 'lodash';
import { usePrevious } from 'react-use';
import { debounce } from 'lodash';
import Icon from 'components/Icon';
import { checkRequiredProperties } from 'utils';
import { FormattedMessage as T, useIntl } from 'react-intl';

export default function FilterDropdown({
  fields,
  onFilterChange,
}) {
  const {formatMessage} =useIntl();

  const conditionalsItems = useMemo(() => [
    { value: 'and', label:formatMessage({id:'and'})  },
    { value: 'or', label: formatMessage({id:'or'}) },
  ], [formatMessage]);

  const resourceFields = useMemo(() => [
    ...fields.map((field) => ({ value: field.key, label: field.label_name, })),
  ], [fields]);

  const compatatorsItems = useMemo(() => [
    {value: '', label:formatMessage({id:'select_a_comparator'})},
    {value: 'equals', label: formatMessage({id:'equals'})},
    {value: 'not_equal', label: formatMessage({id:'not_equal'})},
    {value: 'contain', label: formatMessage({id:'contain'})},
    {value: 'not_contain', label: formatMessage({id:'not_contain'})},
  ], [formatMessage]);

  const defaultFilterCondition = useMemo(() => ({
    condition: 'and',
    field_key: fields.length > 0 ? fields[0].key : '',
    compatator: 'equals',
    value: '',
  }), [fields]);

  const {
    setFieldValue,
    getFieldProps,
    values,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      conditions: [ defaultFilterCondition ],
    },
  });

  const onClickNewFilter = useCallback(() => {
    setFieldValue('conditions', [
      ...values.conditions, defaultFilterCondition,
    ]);
  }, [values, defaultFilterCondition, setFieldValue]);

  const filteredFilterConditions = useMemo(() => {
    const requiredProps = ['field_key', 'condition', 'compatator', 'value'];

    return values.conditions
      .filter((condition) => 
        !checkRequiredProperties(condition, requiredProps));
  }, [values.conditions]);

  const prevConditions = usePrevious(filteredFilterConditions);

  const onFilterChangeThrottled = useRef(debounce((conditions) => {
    onFilterChange && onFilterChange(conditions);
  }, 1000));
 
  useEffect(() => {
    if (!isEqual(prevConditions, filteredFilterConditions) && prevConditions) {
      onFilterChangeThrottled.current(filteredFilterConditions);
    }
  }, [filteredFilterConditions,prevConditions]);

  // Handle click remove condition.
  const onClickRemoveCondition = (index) => () => {
    if (values.conditions.length === 1) {
      setFieldValue('conditions', [
        defaultFilterCondition,
      ]);
      return;
    }
    const conditions = [ ...values.conditions ];
    conditions.splice(index, 1);
    setFieldValue('conditions', [ ...conditions ]);
  };

  return (
    <div class="filter-dropdown">
      <div class="filter-dropdown__body">
        {values.conditions.map((condition, index) => (
          <div class="filter-dropdown__condition">
            <FormGroup
              className={'form-group--condition'}>
              <HTMLSelect
                options={conditionalsItems}
                className={Classes.FILL}
                disabled={index > 1}
                {...getFieldProps(`conditions[${index}].condition`)} />
            </FormGroup>

            <FormGroup
              className={'form-group--field'}>
              <HTMLSelect
                options={resourceFields}
                value={1}
                className={Classes.FILL}
                {...getFieldProps(`conditions[${index}].field_key`)} />
            </FormGroup>

            <FormGroup
              className={'form-group--compatator'}>
              <HTMLSelect
                options={compatatorsItems}
                className={Classes.FILL}
                {...getFieldProps(`conditions[${index}].compatator`)} />
            </FormGroup>

            <FormGroup
              className={'form-group--value'}>
              <InputGroup
                placeholder="Value"
                {...getFieldProps(`conditions[${index}].value`)} />
            </FormGroup>

            <Button 
              icon={<Icon icon="times" />}
              iconSize={14}
              minimal={true}
              onClick={onClickRemoveCondition(index)} />
          </div>
        ))}
      </div>

      <div class="filter-dropdown__footer">
        <Button
          minimal={true}
          intent={Intent.PRIMARY}
          onClick={onClickNewFilter}>
      <T id={'new_conditional'}/>
        </Button>
      </div>
    </div>
  )
}