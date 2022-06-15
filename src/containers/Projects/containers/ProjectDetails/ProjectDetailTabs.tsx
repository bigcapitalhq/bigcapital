import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import { Tabs, Tab } from '@blueprintjs/core';
import TimesheetDataTable from './TimesheetDataTable';

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
        defaultSelectedTabId={'timesheet'}
      >
        <Tab id="overview" title={intl.get('project_details.label.overview')} />
        <Tab
          id="timesheet"
          title={intl.get('project_details.label.timesheet')}
          panel={<TimesheetDataTable />}
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
      padding: 0 20px;
      background-color: #fff;
      border-bottom: 1px solid #d2dce2;

      &.bp3-large > .bp3-tab {
        font-size: 15px;
        font-weight: 400;
        color: #7f8596;
        margin: 0 0.9rem;

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
      border: 2px solid #f0f0f0;
      border-radius: 10px;
      padding: 30px 18px;
      margin: 30px 15px;
      background: #fff;
    }
  }
`;
