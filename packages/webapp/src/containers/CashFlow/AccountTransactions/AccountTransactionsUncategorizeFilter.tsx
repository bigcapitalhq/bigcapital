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
