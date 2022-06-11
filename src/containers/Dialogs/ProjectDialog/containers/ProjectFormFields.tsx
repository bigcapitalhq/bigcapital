// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Classes, Position, FormGroup, ControlGroup } from '@blueprintjs/core';
import { FastField } from 'formik';
import { DateInput } from '@blueprintjs/datetime';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import {
  FFormGroup,
  FInputGroup,
  FCheckbox,
  FDateInput,
  FMoneyInputGroup,
  InputPrependText,
  FormattedMessage as T,
  CustomerSelectField,
} from 'components';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
} from 'utils';
import { useProjectFormContext } from './ProjectFormProvider';

/**
 * Project form fields.
 * @returns
 */
function ProjectFormFields() {
  const { customers } = useProjectFormContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Contact -----------*/}
      <FastField name={'contact'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('projects.label.contact')}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={inputIntent({ error, touched })}
          >
            <CustomerSelectField
              contacts={customers}
              selectedContactId={value}
              defaultSelectText={'Select Contact Account'}
              onContactSelected={(customer) => {
                form.setFieldValue('contact', customer.id);
              }}
              allowCreate={true}
              popoverFill={true}
            />
          </FormGroup>
        )}
      </FastField>
      {/*------------ Project Name -----------*/}
      <FFormGroup
        label={intl.get('projects.label.project_name')}
        name={'project_name'}
      >
        <FInputGroup name="project_name" />
      </FFormGroup>
      {/*------------ DeadLine -----------*/}
      <FFormGroup
        label={intl.get('projects.label.deadline')}
        name={'project_deadline'}
        className={classNames(CLASSES.FILL, 'form-group--date')}
      >
        <FDateInput
          {...momentFormatter('YYYY/MM/DD')}
          name="project_deadline"
          formatDate={(date) => date.toLocaleString()}
          popoverProps={{
            position: Position.BOTTOM,
            minimal: true,
          }}
        />
      </FFormGroup>

      {/*------------ CheckBox -----------*/}
      <FFormGroup name={'project_state'}>
        <FCheckbox
          name="project_state"
          label={intl.get('projects.label.calculator_expenses')}
        />
      </FFormGroup>
      {/*------------ Cost Estimate -----------*/}
      <FFormGroup
        name={'project_cost'}
        label={intl.get('projects.label.cost_estimate')}
      >
        <ControlGroup>
          <InputPrependText text={'USD'} />
          <FMoneyInputGroup
            name={'project_cost'}
            allowDecimals={true}
            allowNegativeValue={true}
          />
        </ControlGroup>
      </FFormGroup>
    </div>
  );
}

export default ProjectFormFields;
