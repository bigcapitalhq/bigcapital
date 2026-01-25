// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { DashboardInsider } from '@/components';
import { CLASSES } from '@/constants/classes';

/**
 * Financial report page.
 */
export default function FinancialReportPage(props) {
  return (
    <FinancialReportPageRoot
      {...props}
      className={classNames(CLASSES.FINANCIAL_REPORT_INSIDER, props.className)}
    />
  );
}

export const FinancialComputeAlert = styled.div`
  --x-background-color: #fdecda;
  --x-text-color: #342515;
  --x-button-text-color: #824400;

  .bp4-dark & {
    --x-background-color: rgba(200, 118, 25, 0.2);
    --x-text-color: rgba(255, 255, 255, 0.8);
    --x-button-text-color: rgba(255, 255, 255, 0.8);
  }
  position: relative;
  padding: 8px 20px;
  border-radius: 2px;
  background-color: var(--x-background-color);
  color: var(--x-text-color);
  font-size: 13px;

  button {
    font-size: 12px;
    min-height: 16px;
    padding: 0 4px;

    &,
    &:hover {
      color: var(--x-button-text-color);
      text-decoration: underline;
    }
  }
  svg {
    margin-right: 6px;
    position: relative;
    top: -2px;
    fill: var(--x-text-color);
  }
`;

export const FinancialProgressbar = styled.div`
  .progress-materializecss {
    top: -2px;
  }
`;

export const FinancialReportPageRoot = styled(DashboardInsider)``;

export const FinancialReportBody = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
