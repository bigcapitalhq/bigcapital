import React from 'react';
import styled from 'styled-components';
import SalesTable from './SalesTable';
import { DashboardContentTable } from 'components';

/**
 *
 * @returns
 */
export default function Sales() {
  return (
    <SalesContentTable>
      <SalesTable />
    </SalesContentTable>
  );
}

const SalesContentTable = styled(DashboardContentTable)``;
