import React, {useEffect, useMemo} from 'react';
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
import Icon from 'components/Icon';

export default function FilterDropdown({
  fields,
  onFilterChange,
}) {
  const conditionalsItems = [
    { value: 'and', label: 'AND' },
    { value: 'or', label: 'OR' },
  ];
  const resourceFields = [
    ...fields.map((field) => ({ value: field.key, label: field.label_name, })),
  ];
  const compatatorsItems = [
    {value: '', label: 'Select a compatator'},
    {value: 'equals', label: 'Equals'},
    {value: 'not_equal', label: 'Not Equal'},
    {value: 'contain', label: 'Contain'},
    {value: 'not_contain', label: 'Not Contain'},
  ];
  const defaultFilterCondition = {
    condition: 'and',
    field_key: fields.length > 0 ? fields[0].key : '',
    compatator: 'equals',
    value: '',
  };
  const formik = useFormik({
    initialValues: {
      conditions: [ defaultFilterCondition ],
    },
  });

  const onClickNewFilter = () => {
    formik.setFieldValue('conditions', [
      ...formik.values.conditions, defaultFilterCondition,
    ]);
  };
  const filteredFilterConditions = useMemo(() => {
    return formik.values.conditions.filter(condition => !!condition.value);
  }, [formik.values.conditions]);

  const prevConditions = usePrevious(filteredFilterConditions);
  
  const onClickRemoveCondition = (index) => () => {
    if (formik.values.conditions.length === 1) { return; }

    const conditions = [ ...formik.values.conditions ];
    conditions.splice(index, 1);
    formik.setFieldValue('conditions', [ ...conditions ]);
  }

  useEffect(() => {
    if (!isEqual(filteredFilterConditions, prevConditions)) {
      onFilterChange(filteredFilterConditions);
    }
  }, [filteredFilterConditions])

  return (
    <div class="filter-dropdown">
      <div class="filter-dropdown__body">
        {formik.values.conditions.map((condition, index) => (
          <div class="filter-dropdown__condition">
            <FormGroup
              className={'form-group--condition'}>
              <HTMLSelect
                options={conditionalsItems}
                className={Classes.FILL}
                disabled={index > 1}
                {...formik.getFieldProps(`conditions[${index}].condition`)} />
            </FormGroup>

            <FormGroup
              className={'form-group--field'}>
              <HTMLSelect
                options={resourceFields}
                value={1}
                className={Classes.FILL}
                {...formik.getFieldProps(`conditions[${index}].field_key`)} />
            </FormGroup>

            <FormGroup
              className={'form-group--compatator'}>
              <HTMLSelect
                options={compatatorsItems}
                className={Classes.FILL}
                {...formik.getFieldProps(`conditions[${index}].compatator`)} />
            </FormGroup>

            <FormGroup
              className={'form-group--value'}>
              <InputGroup
                placeholder="Value"
                {...formik.getFieldProps(`conditions[${index}].value`)} />
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
          + New Conditional
        </Button>
      </div>
    </div>
  )
}