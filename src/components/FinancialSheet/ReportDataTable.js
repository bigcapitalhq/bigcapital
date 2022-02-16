import styled from 'styled-components';

import { DataTable } from 'components';

export const ReportDataTable = styled(DataTable)`
  .table .tbody .tr.no-results:last-of-type .td {
    border-bottom: 1px solid #ddd;
  }
`;
