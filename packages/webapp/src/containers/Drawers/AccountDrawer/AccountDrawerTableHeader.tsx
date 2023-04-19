import React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import styled from 'styled-components';
import { useAccountDrawerTableOptionsContext } from './AccountDrawerTableOptionsProvider';

export function AccountDrawerTableHeader() {
  const {
    setBCYCurrencyType,
    setFYCCurrencyType,
    isBCYCurrencyType,
    isFYCCurrencyType,
  } = useAccountDrawerTableOptionsContext();

  const handleBCYBtnClick = () => {
    setBCYCurrencyType();
  };
  const handleFCYBtnClick = () => {
    setFYCCurrencyType();
  };

  return (
    <TableHeaderRoot>
      <ButtonGroup>
        <Button
          small
          outlined
          onClick={handleFCYBtnClick}
          active={isFYCCurrencyType}
        >
          FCY
        </Button>
        <Button
          small
          outlined
          onClick={handleBCYBtnClick}
          active={isBCYCurrencyType}
        >
          BCY
        </Button>
      </ButtonGroup>
    </TableHeaderRoot>
  );
}

const TableHeaderRoot = styled.div`
  margin-bottom: 1rem;
`;
