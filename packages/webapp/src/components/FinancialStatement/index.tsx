import React from 'react';
import styled, { css } from 'styled-components';

interface FinancialStatementRootProps {
  $showNegativeInRed?: boolean;
}

const FinancialStatementRoot = styled.div<FinancialStatementRootProps>`
  ${({ $showNegativeInRed }) =>
    $showNegativeInRed &&
    css`
      .td.is-negative-amount .cell-inner {
        color: var(--color-financial-sheet-negative-amount-text);
      }
    `}
`;
const FinancialStatementBodyRoot = styled.div``;

interface FinancialStatementProps {
  children?: React.ReactNode;
  className?: string;
}

interface FinancialStatementWithNumberFormatProps
  extends FinancialStatementProps {
  /**
   * The report page's number format. The server applies every other option
   * to the amounts; the wrapper applies only `showInRed`.
   */
  numberFormat?: Record<string, unknown>;
}

export function FinancialStatement({
  children,
  className,
  numberFormat,
}: FinancialStatementWithNumberFormatProps) {
  return (
    <FinancialStatementRoot
      children={children}
      className={className}
      $showNegativeInRed={numberFormat?.showInRed === true}
    />
  );
}

export function FinancialStatementBody({
  children,
  className,
}: FinancialStatementProps) {
  return (
    <FinancialStatementBodyRoot children={children} className={className} />
  );
}
