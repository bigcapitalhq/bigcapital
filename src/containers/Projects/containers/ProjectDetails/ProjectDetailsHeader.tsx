// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormatDate } from '@/components';
import {
  DetailFinancialCard,
  DetailFinancialSection,
} from './components';
import { calculateStatus } from '@/utils';
import { useCalculateProject } from './utils';

import { useProjectDetailContext } from './ProjectDetailProvider';

/**
 * Project details header.
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
        description={intl.get('project_details.label.of_project_estimate', {
          value: percentageOfInvoice,
        })}
        progressValue={calculateStatus(
          project.total_invoiced,
          project.cost_estimate,
        )}
      />
      <DetailFinancialCard
        label={intl.get('project_details.label.time_expenses')}
        value={project.total_expenses_formatted}
        description={intl.get('project_details.label.of_project_estimate', {
          value: percentageOfExpense,
        })}
        progressValue={calculateStatus(
          project.total_expenses,
          project.cost_estimate,
        )}
      />
      <DetailFinancialCard
        label={intl.get('project_details.label.to_be_invoiced')}
        value={project.total_billable_formatted}
      />
      <DetailFinancialCard
        label={'Deadline'}
        value={<FormatDate value={project.deadline_formatted} />}
        description={'4 days to go'}
      />
    </DetailFinancialSection>
  );
}
