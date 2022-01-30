import React from 'react';
import styled from 'styled-components';
import { PopoverInteractionKind, Position, Button } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import WarehousesList from './WarehousesList';
import { Icon, FormattedMessage as T, ButtonLink } from 'components';

export default function IntegrateWarehouseTable() {
  return (
    <Popover2
      minimal={true}
      content={<WarehousesList />}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
    >
      <PopoverLink>→</PopoverLink>
    </Popover2>
  );
}

const PopoverLink = styled.button`
  border: 0;
  cursor: pointer;
  background: transparent;
  margin-top: 18px;
  padding-right: 0px;
  color: #0052cc;

  &:hover,
  &:active {
    text-decoration: underline;
  }
`;
