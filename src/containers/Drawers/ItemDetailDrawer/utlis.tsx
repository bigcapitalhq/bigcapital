// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Intent, Tag } from '@blueprintjs/core';
import { Choose, FormattedMessage as T } from '@/components';

/**
 * items inactive status.
 * @returns {React.JSX}
 */
export function inactiveStatus(item) {
  return (
    <Choose>
      <Choose.When condition={!item.active}>
        {item.name}
        <StatusTag intent={Intent.NONE} minimal={true} round={true}>
          <T id={'item.details.inactive'} />
        </StatusTag>
      </Choose.When>
      <Choose.Otherwise>{item.name}</Choose.Otherwise>
    </Choose>
  );
}

const StatusTag = styled(Tag)`
  font-size: 11px;
  margin-left: 10px;
`;
