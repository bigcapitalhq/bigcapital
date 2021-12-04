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
  ${(props) =>
    props.alignment === 'right' ? 'margin-left: auto;' : 'margin-right: auto;'};

  .bp3-button {
    margin-left: 5px;
    margin-left: 5px;
  }
`;
