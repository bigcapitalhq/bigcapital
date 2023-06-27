// @ts-nocheck
import React from 'react';

import { filterProjectProfitabilityOptions } from './constants';
import { Classes } from '@blueprintjs/core';
import { ProjectMultiSelect } from '@/containers/Projects/components';
import { Row, Col, FFormGroup, FormattedMessage as T } from '@/components';

import FinancialStatementDateRange from '../FinancialStatementDateRange';
import FinancialStatementsFilter from '../FinancialStatementsFilter';
import RadiosAccountingBasis from '../RadiosAccountingBasis';

import { useProjectProfitabilitySummaryContext } from './ProjectProfitabilitySummaryProvider';

/**
 * Project profitability summary header - General panel.
 */
export default function ProjectProfitabilitySummaryHeaderGeneralPanel() {
  const { projects } = useProjectProfitabilitySummaryContext();

  return (
    <div>
      <FinancialStatementDateRange />
      <Row>
        <Col xs={4}>
          <FinancialStatementsFilter
            items={filterProjectProfitabilityOptions}
            initialSelectedItem={'with-transactions'}
            label={
              <T id={'project_profitability_summary.filter_options.label'} />
            }
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <FFormGroup
            name={'projectsIds'}
            label={<T id={'projects_multi_select.label'} />}
            className={Classes.FILL}
          >
            <ProjectMultiSelect name={'projectsIds'} projects={projects} />
          </FFormGroup>
        </Col>
      </Row>
      <RadiosAccountingBasis key={'basis'} />
    </div>
  );
}
