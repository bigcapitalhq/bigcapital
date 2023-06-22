// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useFormikContext } from 'formik';

import { Classes, Position, FormGroup, ControlGroup } from '@blueprintjs/core';
import { FastField } from 'formik';
import { CLASSES } from '@/constants/classes';
import classNames from 'classnames';
import {
  FFormGroup,
  FInputGroup,
  FCheckbox,
  FDateInput,
  FMoneyInputGroup,
  InputPrependText,
  FormattedMessage as T,
  Stack,
  CustomersSelect,
} from '@/components';
import { momentFormatter } from '@/utils';
import { useProjectFormContext } from './ProjectFormProvider';

/**
 * Project form fields.
 * @returns
 */
function ProjectFormFields() {
  // Formik context.
  const { values } = useFormikContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      <Stack spacing={25}>
        {/*------------ Contact -----------*/}
        <ProjectFormCustomerSelect />

        {/*------------ Project Name -----------*/}
        <FFormGroup
          label={intl.get('projects.dialog.project_name')}
          name={'name'}
        >
          <FInputGroup name="name" />
        </FFormGroup>

        <Stack spacing={15}>
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
        </Stack>

        {/*------------ Cost Estimate -----------*/}
        <FFormGroup
          name={'cost_estimate'}
          label={intl.get('projects.dialog.cost_estimate')}
        >
          <ControlGroup>
            <FMoneyInputGroup
              disabled={values.published}
              name={'cost_estimate'}
              allowDecimals={true}
              allowNegativeValue={true}
            />
            <InputPrependText text={'USD'} />
          </ControlGroup>
        </FFormGroup>
      </Stack>
    </div>
  );
}

function ProjectFormCustomerSelect() {
  // project form dialog context.
  const { customers } = useProjectFormContext();

  return (
    <FormGroup name={'contact_id'} label={intl.get('projects.dialog.contact')}>
      <CustomersSelect
        name={'contact_id'}
        items={customers}
        placeholder={'Find or create a customer'}
        allowCreate={true}
        popoverFill={true}
      />
    </FormGroup>
  );
}

export default ProjectFormFields;
