// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { ProgressBar } from '@blueprintjs/core';

export function DetailFinancialSection({ children }) {
  return <FinancialSectionWrap>{children}</FinancialSectionWrap>;
}

export function DetailFinancialCard({ label, value, children }) {
  return (
    <React.Fragment>
      <FinancialSectionCard>
        <FinancialSectionCardContent>
          <FinancialCardTitle>{label}</FinancialCardTitle>
          <FinancialCardValue>{value}</FinancialCardValue>
          {children}
        </FinancialSectionCardContent>
      </FinancialSectionCard>
    </React.Fragment>
  );
}
export const FinancialDescription = ({ childern }) => {
  return <FinancialCardText>{childern}</FinancialCardText>;
};

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
  background-color: #fff;
  border: 1px solid #c8cad0; // #000a1e33 #f0f0f0
`;

const FinancialSectionCardContent = styled.div`
  margin: 16px;
`;

const FinancialCardWrap = styled.div``;

const FinancialCardTitle = styled.div`
  font-size: 15px;
  color: #000;
  white-space: nowrap;
  font-weight: 400;
  line-height: 1.5rem;
`;
const FinancialCardValue = styled.div`
  font-size: 21px;
  line-height: 2rem;
  font-weight: 700;
`;

const FinancialCardStatus = styled.div``;

export const FinancialCardText = styled.div`
  font-size: 13px;
  line-height: 1.5rem;
`;
export const FinancialCardProgressBar = styled(ProgressBar)`
  &.bp3-progress-bar {
    height: 3px;
    &,
    .bp3-progress-meter {
      border-radius: 0;
    }
  }
`;
