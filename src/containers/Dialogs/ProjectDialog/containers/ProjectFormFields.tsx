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
  FMoneyInputGroup,
  InputPrependText,
  FormattedMessage as T,
  CustomerSelectField,
  FCustomerSelectField,
} from 'components';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
} from 'utils';

/**
 * Project form fields.
 * @returns
 */
function ProjectFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Contact -----------*/}
      <FastField name={'contact'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={'Contact'}
            className={classNames('form-group--select-list', Classes.FILL)}
            intent={inputIntent({ error, touched })}
          >
            <CustomerSelectField
              contacts={[]}
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
      <FFormGroup label={'Project Name'} name={'project_name'}>
        <FInputGroup name="project_name" />
      </FFormGroup>
      {/*------------ DeadLine -----------*/}
      <FFormGroup
        label={'DeadLine'}
        name={'project_deadline'}
        className={classNames(CLASSES.FILL, 'form-group--date')}
      >
        <DateInput
          {...momentFormatter('YYYY/MM/DD')}
          // onChange={handleDateChange((formattedDate) => {
          // })}
          // value={tansformDateValue(value)}
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
          label={'Calculato from tasks & estimated expenses'}
        />
      </FFormGroup>
      {/*------------ Cost Estimate -----------*/}
      <FFormGroup name={'project_cost'} label={' Cost Estimate'}>
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
