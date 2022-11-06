// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

const FinancialStatementRoot = styled.div``;
const FinancialStatementBodyRoot = styled.div``;

/**
 * 
 * @returns {React.JSX}
 */
export function FinancialReport({ children, className }) {
  return <FinancialStatementRoot children={children} className={className} />;
}

/**
 *
 * @param {React.JSX}
 */
export function FinancialReportBody({ children, className }) {
  return (
    <FinancialStatementBodyRoot children={children} className={className} />
  );
}
