// @ts-nocheck
import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  vertical-align: top;
  border-color: #dee2e6;
  border-spacing: 0;
`;
export const TBody = styled.tbody``;
export const TR = styled.tr``;
export const TD = styled.td`
  padding: 0.5rem 0.5rem;
  border-bottom-width: 1px;
  border-bottom-color: inherit;
  border-bottom-style: solid;

  ${(props) =>
    props.textAlign === 'right' &&
    `
  text-align: right;`}
`;

export const TRDarkSingleLine = styled(TR)`
  ${TD} {
    border-bottom: 1px solid #000;
  }
`;

export const TRDarkDoubleLines = styled(TR)`
  ${TD} {
    border-bottom: 3px double #000;
  }
`;
