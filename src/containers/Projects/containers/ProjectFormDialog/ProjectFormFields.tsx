// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { Classes, Position, FormGroup, ControlGroup } from '@blueprintjs/core';
import { FastField } from 'formik';
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
        name={'projectName'}
      >
        <FInputGroup name="projectName" />
      </FFormGroup>
      {/*------------ DeadLine -----------*/}
      <FFormGroup
        label={intl.get('projects.label.deadline')}
        name={'projectDeadline'}
        className={classNames(CLASSES.FILL, 'form-group--date')}
      >
        <FDateInput
          {...momentFormatter('YYYY/MM/DD')}
          name="projectDeadline"
          formatDate={(date) => date.toLocaleString()}
          popoverProps={{
            position: Position.BOTTOM,
            minimal: true,
          }}
        />
      </FFormGroup>

      {/*------------ CheckBox -----------*/}
      <FFormGroup name={'projectState'}>
        <FCheckbox
          name="projectState"
          label={intl.get('projects.label.calculator_expenses')}
        />
      </FFormGroup>
      {/*------------ Cost Estimate -----------*/}
      <FFormGroup
        name={'projectCost'}
        label={intl.get('projects.label.cost_estimate')}
      >
        <ControlGroup>
          <InputPrependText text={'USD'} />
          <FMoneyInputGroup
            // disabled={true}
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
