import React from 'react';
import _ from 'lodash';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { Choose, FormattedMessage as T } from '@/components';

export function EstimateAmount() {
  const { values } = useFormikContext();

  // Calculate estimate amount.
  const estimatedAmount = _.multiply(values.rate, values.estimate_minutes);

  return (
    <EstimatedAmountBase>
      <EstimatedAmountContent>
        <Choose>
          <Choose.When condition={values?.charge_type === 'hourly_rate'}>
            <T id={'project_task.dialog.estimated_amount'} />
            <EstimatedAmount>{estimatedAmount}</EstimatedAmount>
          </Choose.When>
          <Choose.When condition={values?.charge_type === 'fixed_price'}>
            <T id={'project_task.dialog.total'} />
            <EstimatedAmount>{values.rate}</EstimatedAmount>
          </Choose.When>
          <Choose.Otherwise>
            <T id={'project_task.dialog.total'} />
            <EstimatedAmount>0.00</EstimatedAmount>
          </Choose.Otherwise>
        </Choose>
      </EstimatedAmountContent>
    </EstimatedAmountBase>
  );
}

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

const EstimatedAmount = styled.span`
  font-size: 15px;
  font-weight: 700;
  margin-left: 10px;
`;
