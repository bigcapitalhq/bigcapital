// @ts-nocheck
import styled from 'styled-components';
import { Tag } from '@blueprintjs/core';

const Root = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 18px;
`;

const FilterTag = styled(Tag)`
  min-height: 26px;

  &.bp4-minimal:not([class*='bp4-intent-']) {
    background: #fff;
    border: 1px solid #e1e2e8;

    &.bp4-interactive:hover {
      background-color: rgba(143, 153, 168, 0.05);
    }
  }
`;

export function AccountTransactionsUncategorizeFilter() {
  return (
    <Root>
      <FilterTag round interactive>
        All <strong>(2)</strong>
      </FilterTag>
      <FilterTag round minimal interactive>
        Recognized <strong>(0)</strong>
      </FilterTag>
    </Root>
  );
}
