// @ts-nocheck

import React from 'react';
import { Button } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import styled from 'styled-components';

/**
 * Projec billable entries item box.
 * @returns
 */
function ProjectBillableEntriesItemBox({ projectBillableEntry }) {
  return (
    <ProjectEntryBox>
      <ProjectEntryHeader>
        <ProjectEntryTitle>{projectBillableEntry.title}</ProjectEntryTitle>
        <ProjectEntrtyItemContent>
          <ProjectEntryItem>{projectBillableEntry.date}</ProjectEntryItem>
          <ProjectEntryItem>{projectBillableEntry.time}</ProjectEntryItem>
        </ProjectEntrtyItemContent>
      </ProjectEntryHeader>
      <ProjectEntryContent>
        <ProjectEntryAmount>{projectBillableEntry.billable_amount}</ProjectEntryAmount>
      </ProjectEntryContent>
      <ProjectEntryFoorer>
        <ProjectEntryButton small={true}>Add</ProjectEntryButton>
        <ProjectEntryButton small={true}>Show</ProjectEntryButton>
      </ProjectEntryFoorer>
    </ProjectEntryBox>
  );
}

/**
 * Project billable entries box.
 * @returns
 */
export function ProjectEntiresBox({ billableEntries }) {
  return billableEntries.map((entries) => (
    <ProjectBillableEntriesItemBox projectBillableEntry={entries} />
  ));
}

const ProjectEntryBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  width: 360px;
  height: 121px;
  border: 1px solid #d4d9df;
  padding: 15px 12px;
  margin-bottom: 15px;
  position: relative;
`;
const ProjectEntryHeader = styled.div``;
const ProjectEntryTitle = styled.div`
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  color: #444444;
`;
const ProjectEntrtyItemContent = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ProjectEntryItem = styled.div`
  font-weight: 400;
  font-size: 10px;
  color: #666666;
`;

const ProjectEntryContent = styled.div`
  flex: 1 0 auto;
  line-height: 2rem;
  border-bottom: 1px solid #e3e3e3;
`;

const ProjectEntryAmount = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #111111;
`;

export const ProjectRowDivider = styled.div`
  height: 1px;
  background: #e3e3e3;
  margin-bottom: 15px;
  margin-top: 15px;
`;

const ProjectEntryFoorer = styled.div`
  padding: 0;
`;

const ProjectEntryButton = styled(Button)`
  &.bp3-button.bp3-small,
  &.bp3-button:not([class*='bp3-intent-']):not(.bp3-minimal).bp3-small {
    font-size: 12px;
    color: #2172ed;
    background: transparent;
    &:last-child {
      margin-right: 5px;
    }
  }
`;
