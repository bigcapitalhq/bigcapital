import React from 'react';
import styled from 'styled-components';
import PurchasesTable from './PurchasesTable';
import { DashboardContentTable } from 'components';

/**
 *
 * @returns
 */
export default function Purchases() {
  return (
    <DashboardContentTable>
      <PurchasesTable />
    </DashboardContentTable>
  );
}

const PurchasesContentTable = styled.div`
  margin: 22px 20px;
  border: 1px solid #d2dce2;
  background: #fff;
  /* .bigcapital-datatable {
    display: flex;
    flex-direction: column;
    flex: 1 0 0;

    .pagination {
      margin-top: auto;
    }

    &:not(.has-pagination) {
      padding-bottom: 30px;
    }
  } */
`;
