// @ts-nocheck
import { Classes, ControlGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { EstimateAmount } from './utils';
import {
  FFormGroup,
  FInputGroup,
  Col,
  Row,
  InputPrependText,
} from '@/components';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

/**
 * Project task form fields.
 * @returns
 */
function ProjectTaskFormFieldsInner() {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

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
      <EstimateAmount baseCurrency={baseCurrency} />
    </div>
  );
}

export const ProjectTaskFormFields = ProjectTaskFormFieldsInner;
