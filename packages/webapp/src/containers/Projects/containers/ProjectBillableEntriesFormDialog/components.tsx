// @ts-nocheck

import React from 'react';
import intl from 'react-intl-universal';
import { Button } from '@blueprintjs/core';
import styled from 'styled-components';

/**
 * Project billable entries box.
 * @returns
 */
function BillableEntriesBox({ billableEntry }) {
  return (
    <BillableEntriesWrap>
      <BillableEntriesHeader>
        <BillableEntryType>
          {intl.get('project_billable_entries.billable_type', {
            value: billableEntry.billable_type,
          })}
        </BillableEntryType>
        <BillableEntryContent>
          <BillableEntryItem>{billableEntry.date}</BillableEntryItem>
          <BillableEntryItem>{billableEntry.time}</BillableEntryItem>
        </BillableEntryContent>
      </BillableEntriesHeader>
      <BillableEntriesContent>
        <BillableEntryAmount>
          {billableEntry.billable_amount_formatted}
        </BillableEntryAmount>
      </BillableEntriesContent>
      <BillableEntryFooter>
        <BillableEntryButton small={true}>
          {intl.get('project_billable_entries.dialog.add')}
        </BillableEntryButton>
        <BillableEntryButton small={true}>
          {intl.get('project_billable_entries.dialog.show')}
        </BillableEntryButton>
      </BillableEntryFooter>
    </BillableEntriesWrap>
  );
}

/**
 * Project billable entries box.
 * @returns
 */
export function BillableEntiresBox({ billableEntries }) {
  return billableEntries.map((entries) => (
    <BillableEntriesBox billableEntry={entries} />
  ));
}

const BillableEntriesWrap = styled.div`
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
const BillableEntriesHeader = styled.div``;
const BillableEntryType = styled.div`
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  color: #444444;
`;
const BillableEntryContent = styled.div`
  display: flex;
  justify-content: space-between;
`;
const BillableEntryItem = styled.div`
  font-weight: 400;
  font-size: 10px;
  color: #666666;
`;

const BillableEntriesContent = styled.div`
  flex: 1 0 auto;
  line-height: 2rem;
  border-bottom: 1px solid #e3e3e3;
`;

const BillableEntryAmount = styled.div`
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

const BillableEntryFooter = styled.div`
  padding: 0;
`;

const BillableEntryButton = styled(Button)`
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
