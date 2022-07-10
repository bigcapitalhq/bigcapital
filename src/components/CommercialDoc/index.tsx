import styled from 'styled-components';
import { Card } from '../Card';
import { DataTable } from '../Datatable';

export const CommercialDocBox = styled(Card)`
  padding: 22px 20px;
`;

export const CommercialDocHeader = styled.div`
  margin-bottom: 25px;
`;

export const CommercialDocTopHeader = styled.div`
  margin-bottom: 30px;
`;

export const CommercialDocEntriesTable = styled(DataTable)`
  .tbody .tr:last-child .td {
    border-bottom: 1px solid #d2dce2;
  }
`;

export const CommercialDocFooter = styled.div`
  margin-top: 28px;
`;
