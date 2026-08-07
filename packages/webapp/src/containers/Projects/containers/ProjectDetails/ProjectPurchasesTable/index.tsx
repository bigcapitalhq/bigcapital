// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { ProjectDetailHeader } from '../ProjectDetailsHeader';
import { ProjectPurchasesTable } from './ProjectPurchasesTable';
import { Box, DashboardContentTable } from '@/components';

/**
 *
 * @returns
 */
export function ProjectPurchasesTableRoot() {
  return (
    <Box>
      <ProjectDetailHeader />
      <DashboardContentTable>
        <ProjectPurchasesTable />
      </DashboardContentTable>
    </Box>
  );
}
