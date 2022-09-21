// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { BillableEntriesItems } from './components';
import { useProjectBillableEntriesContext } from './ProjectBillableEntriesProvider';

/**
 * Project billable entries content.
 */
export default function ProjectBillableEntriesContent() {
  const { billableEntries } = useProjectBillableEntriesContext();

  return (
    <BillableEntriesContentRoot>
      <BillableEntriesItems billableEntries={billableEntries} />
    </BillableEntriesContentRoot>
  );
}

const BillableEntriesContentRoot = styled.div`
  width: 400px;
  padding: 6px 12px;
`;
