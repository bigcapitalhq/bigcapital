import React from 'react';
import styled from 'styled-components';
import { Classes } from '@blueprintjs/core';

export function DialogFooterActions({ alignment = 'right', children }) {
  return (
    <DialogFooterActionsRoot
      className={Classes.DIALOG_FOOTER_ACTIONS}
      alignment={alignment}
    >
      {children}
    </DialogFooterActionsRoot>
  );
}

const DialogFooterActionsRoot = styled.div`
  margin-left: -10px;
  margin-right: -10px;
  justify-content: ${(props) =>
    props.alignment === 'right' ? 'flex-end' : 'flex-start'};

  .bp3-button {
    margin-left: 10px;
    margin-left: 10px;
  }
`;
