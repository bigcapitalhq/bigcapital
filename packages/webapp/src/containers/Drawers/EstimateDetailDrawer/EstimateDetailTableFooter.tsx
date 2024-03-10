// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';

/**
 * Estimate details panel footer content.
 */
export default function EstimateDetailTableFooter() {
  const { estimate } = useEstimateDetailDrawerContext();

  return (
    <EstimateDetailsFooterRoot>
      <EstimateTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'estimate.details.subtotal'} />}
          value={estimate.formatted_subtotal}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'estimate.details.total'} />}
          value={estimate.formatted_amount}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </EstimateTotalLines>
    </EstimateDetailsFooterRoot>
  );
}

export const EstimateDetailsFooterRoot = styled.div``;

export const EstimateTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
