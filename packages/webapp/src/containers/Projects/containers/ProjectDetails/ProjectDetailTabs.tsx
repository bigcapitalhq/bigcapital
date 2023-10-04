// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Tabs, Tab } from '@blueprintjs/core';
import ProjectTimeSheets from './ProjectTimeSheets';
import ProjectTasks from './ProjectTasks';
import ProjectPurchasesTable from './ProjectPurchasesTable';
import ProjectSalesTable from './ProjectSalesTable';

/**
 * Project detail tabs.
 * @returns
 */
export default function ProjectDetailTabs() {
  return (
    <ProjectTabsContent>
      <Tabs
        animate={true}
        large={true}
        renderActiveTabPanelOnly={true}
        defaultSelectedTabId={'tasks'}
      >
        <Tab
          id="tasks"
          title={intl.get('project_details.label.tasks')}
          panel={<ProjectTasks />}
        />
        <Tab
          id="timesheet"
          title={intl.get('project_details.label.timesheet')}
          panel={<ProjectTimeSheets />}
        />
        <Tab
          id="purchases"
          title={intl.get('project_details.label.purchases')}
          panel={<ProjectPurchasesTable />}
        />
        <Tab
          id="sales"
          title={intl.get('project_details.label.sales')}
          panel={<ProjectSalesTable />}
        />
        <Tab id="journals" title={intl.get('project_details.label.journals')} />
      </Tabs>
    </ProjectTabsContent>
  );
}

const ProjectTabsContent = styled.div`
  .bp4-tabs {
    .bp4-tab-list {
      padding: 0 20px;
      background-color: #fff;
      border-bottom: 1px solid #d2dce2;

      > *:not(:last-child) {
        margin-right: 0;
      }

      &.bp4-large > .bp4-tab {
        font-size: 15px;
        font-weight: 400;
        color: #7f8596;
        margin: 0 0.9rem;

        &[aria-selected='true'],
        &:not([aria-disabled='true']):hover {
          color: #0052cc;
        }
      }
      .bp4-tab-indicator-wrapper .bp4-tab-indicator {
        height: 2px;
        bottom: -2px;
      }
    }
    .bp4-tab-panel {
      /* margin: 20px 32px; */
      /* margin: 20px; */
      /* margin-top: 20px;
      margin-bottom: 20px;
      padding: 0 25px; */
    }
  }
`;
