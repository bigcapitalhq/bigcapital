// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Classes } from '@blueprintjs/core';

/**
 * Dialog footer actions.
 * @returns {React.JSX}
 */
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

/**
 * Dialog footer.
 * @returns {React.JSX}
 */
export function DialogFooter({ ...props }) {
  return <DialogFooterRoot {...props} />;
}

const DialogFooterRoot = styled.div`
  flex: 0 0 auto;
  margin: 0 20px;
`;

const DialogFooterActionsRoot = styled.div`
  ${(props) =>
    props.alignment === 'right' ? 'margin-left: auto;' : 'margin-right: auto;'};

  .bp4-button {
    margin-left: 5px;
    margin-left: 5px;
  }
`;
