// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import { Classes, ControlGroup } from '@blueprintjs/core';
import {
  FFormGroup,
  FInputGroup,
  Col,
  Row,
  FormattedMessage as T,
  InputPrependText,
} from '@/components';
import { EstimateAmount } from './utils';
import withCurrentOrganization from '@/containers/Organization/withCurrentOrganization';
import { compose } from '@/utils';

/**
 * Project task form fields.
 * @returns
 */
function ProjectTaskFormFields({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  // Formik context.
  const { values } = useFormikContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Task Name -----------*/}
      <FFormGroup
        label={<T id={'project_task.dialog.task_name'} />}
        name={'taskName'}
      >
        <FInputGroup name="name" />
      </FFormGroup>
      {/*------------ Estimated Hours -----------*/}
      <Row>
        <Col xs={4}>
          <FFormGroup
            label={<T id={'project_task.dialog.estimated_hours'} />}
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
            label={<T id={'project_task.dialog.charge'} />}
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

export default compose(withCurrentOrganization())(ProjectTaskFormFields);
