// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import styled from 'styled-components';
import { Intent } from '@blueprintjs/core';
import { FormatDate } from '@/components';
import {
  DetailFinancialCard,
  DetailFinancialSection,
  FinancialProgressBar,
  FinancialCardText,
} from './components';
import { calculateStatus } from '@/utils';
import { useCalculateProject } from './utils';

import { useProjectDetailContext } from './ProjectDetailProvider';

/**
 * Project details header.
 * @returns
 */
export function ProjectDetailHeader() {
  const { project } = useProjectDetailContext();

  const { percentageOfInvoice, percentageOfExpense } = useCalculateProject();

  return (
    <DetailFinancialSection>
      <DetailFinancialCard
        label={intl.get('project_details.label.project_estimate')}
        value={project.cost_estimate_formatted}
      />
      <DetailFinancialCard
        label={intl.get('project_details.label.invoiced')}
        value={project.total_invoiced_formatted}
      >
        <FinancialCardText>
          {intl.get('project_details.label.of_project_estimate', {
            value: percentageOfInvoice,
          })}
        </FinancialCardText>
        <FinancialProgressBar
          intent={Intent.NONE}
          value={calculateStatus(project.total_invoiced, project.cost_estimate)}
        />
      </DetailFinancialCard>
      <DetailFinancialCard
        label={intl.get('project_details.label.time_expenses')}
        value={project.total_expenses_formatted}
      >
        <FinancialCardText>
          {intl.get('project_details.label.of_project_estimate', {
            value: percentageOfExpense,
          })}
        </FinancialCardText>
        <FinancialProgressBar
          intent={Intent.NONE}
          value={calculateStatus(project.total_expenses, project.cost_estimate)}
        />
      </DetailFinancialCard>

      <DetailFinancialCard
        label={intl.get('project_details.label.to_be_invoiced')}
        value={project.total_billable_formatted}
      />
      <DetailFinancialCard
        label={'Deadline'}
        value={<FormatDate value={project.deadline_formatted} />}
      >
        <FinancialCardText>4 days to go</FinancialCardText>
      </DetailFinancialCard>
    </DetailFinancialSection>
  );
}
