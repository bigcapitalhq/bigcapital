import React from 'react';
import styled from 'styled-components';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';

/**
 * Estimate details panel footer content.
 */
export function EstimateDetailTableFooter() {
  const { estimate } = useEstimateDetailDrawerContext();

  if (!estimate) {
    return null;
  }

  return (
    <EstimateDetailsFooterRoot>
      <EstimateTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'estimate.details.subtotal'} />}
          value={estimate.formattedSubtotal}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        {estimate?.discountAmountFormatted && (
          <TotalLine
            title={
              estimate.discountPercentageFormatted
                ? `Discount [${estimate.discountPercentageFormatted}]`
                : 'Discount'
            }
            value={estimate.discountAmountFormatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        {estimate?.adjustmentFormatted && (
          <TotalLine
            title="Adjustment"
            value={estimate.adjustmentFormatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        <TotalLine
          title={<T id={'estimate.details.total'} />}
          value={estimate.totalFormatted}
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
