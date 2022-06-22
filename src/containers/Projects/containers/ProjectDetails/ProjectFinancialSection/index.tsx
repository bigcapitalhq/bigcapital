import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { Intent, ProgressBar } from '@blueprintjs/core';
import { FormatDate } from 'components';

import { calculateStatus } from 'utils';


/**
 * Project Financial Section.
 * @returns
 */
export default function ProjectFinancialSection() {
  return (
    <ProjectFinancialSectionRoot>
      <FinancialSectionCard>
        <FinancialSectionContent>
          <FinancialSectionTitle>Project estimate</FinancialSectionTitle>
          <FinancialSectionValue>3.14</FinancialSectionValue>
        </FinancialSectionContent>
      </FinancialSectionCard>

      <FinancialSectionCard>
        <FinancialSectionContent>
          <FinancialSectionTitle>Invoiced</FinancialSectionTitle>
          <FinancialSectionValue>0.00</FinancialSectionValue>
          <FinancialSectionStatus>
            <FinancialSectionText>0% of project estimate</FinancialSectionText>
            <FinancialSectionProgressBar
              animate={false}
              intent={Intent.NONE}
              value={0}
            />
          </FinancialSectionStatus>
        </FinancialSectionContent>
      </FinancialSectionCard>

      <FinancialSectionCard>
        <FinancialSectionContent>
          <FinancialSectionTitle>Time & Expenses</FinancialSectionTitle>
          <FinancialSectionValue>0.00</FinancialSectionValue>
          <FinancialSectionStatus>
            <FinancialSectionText>0% of project estimate</FinancialSectionText>
            <FinancialSectionProgressBar
              animate={false}
              intent={Intent.NONE}
              value={0}
            />
          </FinancialSectionStatus>
        </FinancialSectionContent>
      </FinancialSectionCard>

      <FinancialSectionCard>
        <FinancialSectionContent>
          <FinancialSectionTitle>To be invoiced</FinancialSectionTitle>
          <FinancialSectionValue>3.14</FinancialSectionValue>
        </FinancialSectionContent>
      </FinancialSectionCard>

      <FinancialSectionCard>
        <FinancialSectionContent>
          <FinancialSectionTitle>Deadline</FinancialSectionTitle>
          <FinancialSectionValue>
            <FormatDate value={'2022-06-08T22:00:00.000Z'} />
          </FinancialSectionValue>
          <FinancialSectionText>4 days to go</FinancialSectionText>
        </FinancialSectionContent>
      </FinancialSectionCard>
    </ProjectFinancialSectionRoot>
  );
}

export const ProjectFinancialSectionRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 20px 20px 20px;
  gap: 10px;
`;

export const FinancialSectionCard = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-radius: 3px;
  width: 220px;
  height: 116px;
  background-color: #fff;
  border: 1px solid #c8cad0; // #000a1e33 #f0f0f0
`;

export const FinancialSectionContent = styled.div`
  margin: 16px;
  /* flex-direction: column; */
`;

export const FinancialSectionTitle = styled.div`
  font-size: 15px;
  color: #000;
  white-space: nowrap;
  font-weight: 400;
  line-height: 1.5rem;
`;
export const FinancialSectionValue = styled.div`
  font-size: 21px;
  line-height: 2rem;
  font-weight: 700;
`;

export const FinancialSectionStatus = styled.div``;

export const FinancialSectionText = styled.div`
  font-size: 13px;
  line-height: 1.5rem;
`;
export const FinancialSectionProgressBar = styled(ProgressBar)`
  &.bp3-progress-bar {
    height: 3px;
    &,
    .bp3-progress-meter {
      border-radius: 0;
    }
  }
`;
