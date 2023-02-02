// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

const FinancialStatementRoot = styled.div``;
const FinancialStatementBodyRoot = styled.div``;

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function FinancialStatement({ children, className }) {
  return <FinancialStatementRoot children={children} className={className} />;
}

/**
 *
 * @param {React.JSX}
 */
export function FinancialStatementBody({ children, className }) {
  return (
    <FinancialStatementBodyRoot children={children} className={className} />
  );
}
