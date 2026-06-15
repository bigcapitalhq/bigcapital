// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Classes, ControlGroup } from '@blueprintjs/core';
import {
  FFormGroup,
  FInputGroup,
  Col,
  Row,
  InputPrependText,
} from '@/components';
import { EstimateAmount } from './utils';
import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';
import intl from 'react-intl-universal';
import { flow } from 'fp-ts/function';

/**
 * Project task form fields.
 * @returns
 */
function ProjectTaskFormFieldsInner({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  // Formik context.
  const { values } = useFormikContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Task Name -----------*/}
      <FFormGroup
        label={intl.get('project_task.dialog.task_name')}
        name={'taskName'}
      >
        <FInputGroup name="name" />
      </FFormGroup>
      {/*------------ Estimated Hours -----------*/}
      <Row>
        <Col xs={4}>
          <FFormGroup
            label={intl.get('project_task.dialog.estimated_hours')}
            name={'estimate_hours'}
          >
            <FInputGroup name="estimate_hours" />
          </FFormGroup>
        </Col>
        {/*------------ Charge -----------*/}
        <Col xs={8}>
          <FFormGroup
            name={'rate'}
            className={'form-group--select-list'}
            label={intl.get('project_task.dialog.charge')}
          >
            <ControlGroup>
              <InputPrependText text={'Hourly Price'} />
              <FInputGroup
                name="rate"
                disabled={values?.charge_type === 'non_chargable'}
              />
            </ControlGroup>
          </FFormGroup>
        </Col>
      </Row>
      {/*------------ Estimated Amount -----------*/}
      <EstimateAmount baseCurrency={base_currency} />
    </div>
  );
}

export const ProjectTaskFormFields = flow(withCurrentOrganization())(
  ProjectTaskFormFieldsInner,
);
