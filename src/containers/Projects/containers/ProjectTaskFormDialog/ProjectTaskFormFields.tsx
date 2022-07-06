//@ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import { Classes, ControlGroup } from '@blueprintjs/core';
import {
  FFormGroup,
  FInputGroup,
  Col,
  Row,
  FormattedMessage as T,
} from 'components';
import { taskChargeOptions } from 'containers/Projects/containers/common/modalChargeOptions';
import { ChangeTypesSelect } from '../../components';

/**
 * Project task form fields.
 * @returns
 */
function ProjectTaskFormFields() {
  // Formik context.
  const { values } = useFormikContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Task Name -----------*/}
      <FFormGroup label={<T id={'project_task.dialog.task_name'} />} name={'taskName'}>
        <FInputGroup name="taskName" />
      </FFormGroup>
      {/*------------ Estimated Hours -----------*/}
      <Row>
        <Col xs={4}>
          <FFormGroup
            label={<T id={'project_task.dialog.estimated_hours'} />}
            name={'taskHouse'}
          >
            <FInputGroup name="taskHouse" />
          </FFormGroup>
        </Col>
        {/*------------ Charge -----------*/}
        <Col xs={8}>
          <FFormGroup
            name={'taskCharge'}
            className={'form-group--select-list'}
            label={<T id={'project_task.dialog.charge'} />}
          >
            <ControlGroup>
              <ChangeTypesSelect
                name="taskCharge"
                items={taskChargeOptions}
                popoverProps={{ minimal: true }}
                filterable={false}
              />
              <FInputGroup
                name="taskamount"
                disabled={values?.taskCharge === 'Non-chargeable'}
              />
            </ControlGroup>
          </FFormGroup>
        </Col>
      </Row>
      {/*------------ Estimated Amount -----------*/}
      <EstimatedAmountBase>
        <EstimatedAmountContent>
          <T id={'project_task.dialog.estimated_amount'} />
          <EstimateAmount>0.00</EstimateAmount>
        </EstimatedAmountContent>
      </EstimatedAmountBase>
    </div>
  );
}

export default ProjectTaskFormFields;

const EstimatedAmountBase = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  line-height: 1.5rem;
  opacity: 0.75;
`;

const EstimatedAmountContent = styled.span`
  background-color: #fffdf5;
  padding: 0.1rem 0;
`;

const EstimateAmount = styled.span`
  font-size: 15px;
  font-weight: 700;
  margin-left: 10px;
`;
