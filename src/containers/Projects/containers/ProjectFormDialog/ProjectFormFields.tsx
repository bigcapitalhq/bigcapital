// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useFormikContext } from 'formik';

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
  FieldRequiredHint,
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
  // project form dialog context.
  const { customers } = useProjectFormContext();

  // Formik context.
  const { values } = useFormikContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Contact -----------*/}
      <FastField name={'contact_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={intl.get('projects.dialog.contact')}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={inputIntent({ error, touched })}
          >
            <CustomerSelectField
              contacts={customers}
              selectedContactId={value}
              defaultSelectText={'Select Contact Account'}
              onContactSelected={(customer) => {
                form.setFieldValue('contact_id', customer.id);
              }}
              allowCreate={true}
              popoverFill={true}
            />
          </FormGroup>
        )}
      </FastField>
      {/*------------ Project Name -----------*/}
      <FFormGroup
        label={intl.get('projects.dialog.project_name')}
        name={'name'}
      >
        <FInputGroup name="name" />
      </FFormGroup>
      {/*------------ DeadLine -----------*/}
      <FFormGroup
        label={intl.get('projects.dialog.deadline')}
        name={'deadline'}
        className={classNames(CLASSES.FILL, 'form-group--date')}
      >
        <FDateInput
          {...momentFormatter('YYYY/MM/DD')}
          name="deadline"
          formatDate={(date) => date.toLocaleString()}
          popoverProps={{
            position: Position.BOTTOM,
            minimal: true,
          }}
        />
      </FFormGroup>

      {/*------------ CheckBox -----------*/}
      <FFormGroup name={'published'}>
        <FCheckbox
          name="published"
          label={intl.get('projects.dialog.calculator_expenses')}
        />
      </FFormGroup>
      {/*------------ Cost Estimate -----------*/}
      <FFormGroup
        name={'cost_estimate'}
        label={intl.get('projects.dialog.cost_estimate')}
      >
        <ControlGroup>
          <InputPrependText text={'USD'} />
          <FMoneyInputGroup
            disabled={values.published}
            name={'cost_estimate'}
            allowDecimals={true}
            allowNegativeValue={true}
          />
        </ControlGroup>
      </FFormGroup>
    </div>
  );
}

export default ProjectFormFields;
