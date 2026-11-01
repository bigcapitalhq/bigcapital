import React from 'react';
import styled from 'styled-components';

const FinancialStatementRoot = styled.div``;
const FinancialStatementBodyRoot = styled.div``;

interface FinancialStatementProps {
  children?: React.ReactNode;
  className?: string;
}

export function FinancialStatement({
  children,
  className,
}: FinancialStatementProps) {
  return <FinancialStatementRoot children={children} className={className} />;
}

export function FinancialStatementBody({
  children,
  className,
}: FinancialStatementProps) {
  return (
    <FinancialStatementBodyRoot children={children} className={className} />
  );
}
