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
import { modalChargeOptions } from '../../../../common/modalChargeOptions';

import { TaskModalChargeSelect } from './components';

/**
 * Task form fields.
 * @returns
 */
function TaskFormFields() {
  // Formik context.
  const { values } = useFormikContext();

  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Task Name -----------*/}
      <FFormGroup label={<T id={'task.dialog.task_name'} />} name={'taskName'}>
        <FInputGroup name="taskName" />
      </FFormGroup>
      {/*------------ Estimated Hours -----------*/}
      <Row>
        <Col xs={4}>
          <FFormGroup
            label={<T id={'task.dialog.estimated_hours'} />}
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
            label={<T id={'task.dialog.charge'} />}
          >
            <ControlGroup>
              <TaskModalChargeSelect
                name="taskCharge"
                items={modalChargeOptions}
                popoverProps={{ minimal: true }}
                filterable={false}
              />
              <FInputGroup name="taskamount" />
            </ControlGroup>
          </FFormGroup>
        </Col>
      </Row>
      {/*------------ Estimated Amount -----------*/}
      <EstimatedAmountBase>
        <EstimatedAmountContent>
          <T id={'task.dialog.estimated_amount'} />
          <EstimateAmount>$100000</EstimateAmount>
        </EstimatedAmountContent>
      </EstimatedAmountBase>
    </div>
  );
}

export default TaskFormFields;

const EstimatedAmountBase = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 12px;
  /* opacity: 0.7; */
`;

const EstimatedAmountContent = styled.span`
  background-color: #fffdf5;
  padding: 0.1rem 0;
`;

const EstimateAmount = styled.span`
  font-size: 13px;
  font-weight: 700;
  margin-left: 10px;
`;
