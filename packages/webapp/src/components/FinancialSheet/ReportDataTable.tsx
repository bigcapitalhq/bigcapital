// @ts-nocheck
import styled from 'styled-components';

import { DataTable } from '../Datatable';

export const ReportDataTable = styled(DataTable)`
  --x-table-no-results-border-color: #ddd;

  .bp4-dark & {
    --x-table-no-results-border-color: var(--color-dark-gray5);
  }
  .table .tbody .tr.no-results:last-of-type .td {
    border-bottom: 1px solid var(--x-table-no-results-border-color);
  }
`;
