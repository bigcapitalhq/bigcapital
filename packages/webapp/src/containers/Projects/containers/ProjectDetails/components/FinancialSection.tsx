// @ts-nocheck
import React from 'react';
import { isUndefined } from 'lodash';
import styled from 'styled-components';
import { Intent, ProgressBar } from '@blueprintjs/core';

export function DetailFinancialSection({ children }) {
  return <FinancialSectionWrap>{children}</FinancialSectionWrap>;
}

interface DetailFinancialCardProps {
  label: string;
  value: number;
  description: string | JSX.Element;
  progressValue: number;
}

export function DetailFinancialCard({
  label,
  value,
  description,
  progressValue,
}: DetailFinancialCardProps) {
  return (
    <FinancialSectionCard>
      <FinancialCardTitle>{label}</FinancialCardTitle>
      <FinancialCardValue>{value}</FinancialCardValue>
      {description && <FinancialCartDesc>{description}</FinancialCartDesc>}
      {!isUndefined(progressValue) && (
        <FinancialProgressBar intent={Intent.NONE} value={progressValue} />
      )}
    </FinancialSectionCard>
  );
}

export const FinancialProgressBar = ({ ...rest }) => {
  return <FinancialCardProgressBar animate={false} stripes={false} {...rest} />;
};

const FinancialSectionWrap = styled.div`
  display: flex;
  margin: 22px 32px;
  gap: 10px;
`;

const FinancialSectionCard = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  border-radius: 3px;
  width: 230px;
  height: 116px;
  padding: 16px;
  background-color: #fff;
  border: 1px solid #c8cad0;
  gap: 6px;
`;

const FinancialCardTitle = styled.div`
  font-size: 14px;
  color: #203252;
  white-space: nowrap;
  font-weight: 400;
`;
const FinancialCardValue = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const FinancialCartDesc = styled.div`
  font-size: 12px;
`;

export const FinancialCardText = styled.div`
  font-size: 13px;
  color: #7b8195;
`;
export const FinancialCardProgressBar = styled(ProgressBar)`
  &.bp4-progress-bar {
    height: 3px;
    &,
    .bp4-progress-meter {
      border-radius: 0;
    }
  }
`;
