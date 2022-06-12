import React from 'react';
import styled from 'styled-components';
import { Classes, ControlGroup } from '@blueprintjs/core';
import {
  FFormGroup,
  FInputGroup,
  Col,
  Row,
  FormattedMessage as T,
} from 'components';

/**
 * Task form fields.
 * @returns
 */
function TaskFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------ Task Name -----------*/}
      <FFormGroup label={<T id={'task.label.task_name'} />} name={'task_name'}>
        <FInputGroup name="taskName" />
      </FFormGroup>
      {/*------------ Estimated Hours -----------*/}
      <Row>
        <Col xs={4}>
          <FFormGroup
            label={<T id={'task.label.estimated_hours'} />}
            name={'taskHouse'}
          >
            <FInputGroup name="taskHouse" />
          </FFormGroup>
        </Col>
        {/*------------ Charge -----------*/}
        <Col xs={8}>
          <FFormGroup label={<T id={'task.label.charge'} />} name={'Charge'}>
            <ControlGroup>
              <FInputGroup name="change" />
              <FInputGroup name="changeAmount" />
            </ControlGroup>
          </FFormGroup>
        </Col>
      </Row>
      {/*------------ Estimated Amount -----------*/}
      <EstimatedAmountBase>
        <EstimatedAmountContent>
          <T id={'task.label.estimated_amount'} />
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
