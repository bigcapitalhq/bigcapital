// @ts-nocheck
import styled from 'styled-components';
import { DataTable } from '../Datatable';
import { NS } from '@/constants/classes';

export const ReportDataTable = styled(DataTable)`
  --x-table-no-results-border-color: #ddd;

  .${NS}-dark & {
    --x-table-no-results-border-color: var(--color-dark-gray5);
  }
  .table .tbody .tr.no-results:last-of-type .td {
    border-bottom: 1px solid var(--x-table-no-results-border-color);
  }
`;
