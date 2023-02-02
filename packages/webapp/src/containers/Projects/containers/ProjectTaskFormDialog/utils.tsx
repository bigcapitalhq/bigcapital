// @ts-nocheck
import React from 'react';
import _ from 'lodash';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { Choose, Money, FormattedMessage as T } from '@/components';

export function EstimateAmount({ baseCurrency }) {
  const { values } = useFormikContext();

  // Calculate estimate amount.
  const estimatedAmount = _.multiply(values.rate, values.estimate_hours);

  return (
    <EstimatedAmountBase>
      <EstimatedAmountContent>
        <EstimatedText>
          <T id={'project_task.dialog.estimated_amount'} />
        </EstimatedText>
        <EstimatedAmount>
          <Money amount={estimatedAmount} currency={baseCurrency} />
        </EstimatedAmount>
      </EstimatedAmountContent>
    </EstimatedAmountBase>
  );
}

const EstimatedAmountBase = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
`;

const EstimatedAmountContent = styled.span`
  background-color: #fffdf5;
  padding: 0.1rem 0;
`;

const EstimatedAmount = styled.span`
  font-size: 18px;
  font-weight: 600;
  margin-left: 10px;
`;

const EstimatedText = styled.span`
  color: #607090;
`;
