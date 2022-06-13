import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Tabs, Tab } from '@blueprintjs/core';
import TimeSheetDataTable from './TimeSheet/TimeSheetDataTable';

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
        defaultSelectedTabId={'overview'}
      >
        <Tab id="overview" title={intl.get('project_details.label.overview')} />
        <Tab
          id="timesheet"
          title={intl.get('project_details.label.timesheet')}
          panel={<TimeSheetDataTable />}
        />
        <Tab
          id="purchases"
          title={intl.get('project_details.label.purchases')}
        />
        <Tab id="sales" title={intl.get('project_details.label.sales')} />
        <Tab id="journals" title={intl.get('project_details.label.journals')} />
      </Tabs>
    </ProjectTabsContent>
  );
}

const ProjectTabsContent = styled.div`
  .bp3-tabs {
    .bp3-tab-list {
      position: relative;
      background-color: #fff;
      padding: 0 20px;
      border-bottom: 1px solid #d2dce2;

      &.bp3-large > .bp3-tab {
        font-size: 14px;
        font-weight: 400;
        color: #646a7d;
        margin: 0 1rem;

        &[aria-selected='true'],
        &:not([aria-disabled='true']):hover {
          color: #0052cc;
        }
      }
      .bp3-tab-indicator-wrapper .bp3-tab-indicator {
        height: 2px;
        bottom: -2px;
      }
    }
    .bp3-tab-panel {
      margin-top: 0;
    }
  }
`;
