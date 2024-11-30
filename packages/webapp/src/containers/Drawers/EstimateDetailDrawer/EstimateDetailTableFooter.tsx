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
        {estimate.discount_amount > 0 && (
          <TotalLine
            title={
              estimate.discount_percentage_formatted
                ? `Discount [${invoice.discount_percentage_formatted}]`
                : 'Discount'
            }
            value={estimate.discount_amount_formatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
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
