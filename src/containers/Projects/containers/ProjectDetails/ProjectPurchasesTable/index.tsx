// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { ProjectPurchasesTable } from './ProjectPurchasesTable';
import { Box, DashboardContentTable } from '@/components';
import { ProjectDetailHeader } from '../ProjectDetailsHeader';

/**
 *
 * @returns
 */
export default function ProjectPurchasesTableRoot() {
  return (
    <Box>
      <ProjectDetailHeader />
      <DashboardContentTable>
        <ProjectPurchasesTable />
      </DashboardContentTable>
    </Box>
  );
}
