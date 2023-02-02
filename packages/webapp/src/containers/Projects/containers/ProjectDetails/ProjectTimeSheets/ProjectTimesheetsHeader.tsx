// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Intent } from '@blueprintjs/core';
import { FormatDate } from '@/components';
import {
  DetailFinancialCard,
  DetailFinancialSection,
  FinancialProgressBar,
  FinancialCardText,
} from '../components';
import { calculateStatus } from '@/utils';

/**
 * Project Timesheets header
 * @returns
 */
export function ProjectTimesheetsHeader() {
  return (
    <DetailFinancialSection>
      <DetailFinancialCard label={'Project estimate'} value={'3.14'} />
      <DetailFinancialCard label={'Invoiced'} value={'0.00'}>
        <FinancialCardText>0% of project estimate</FinancialCardText>
        <FinancialProgressBar intent={Intent.NONE} value={0} />
      </DetailFinancialCard>
      <DetailFinancialCard label={'Time & Expenses'} value={'0.00'}>
        <FinancialCardText>0% of project estimate</FinancialCardText>
        <FinancialProgressBar intent={Intent.NONE} value={0} />
      </DetailFinancialCard>

      <DetailFinancialCard label={'To be invoiced'} value={'3.14'} />
      <DetailFinancialCard
        label={'Deadline'}
        value={<FormatDate value={'2022-06-08T22:00:00.000Z'} />}
      >
        <FinancialCardText>4 days to go</FinancialCardText>
      </DetailFinancialCard>
    </DetailFinancialSection>
  );
}
