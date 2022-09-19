// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { ProjectPurchasesTable } from './ProjectPurchasesTable';
import { DashboardContentTable } from '@/components';

/**
 *
 * @returns
 */
export default function ProjectPurchasesTableRoot() {
  return (
    <DashboardContentTable>
      <ProjectPurchasesTable />
    </DashboardContentTable>
  );
}
