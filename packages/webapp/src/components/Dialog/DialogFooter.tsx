// @ts-nocheck
import { Classes } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';

export function DialogFooter({ children }) {
  return (
    <DialogFooterRoot className={Classes.DIALOG_FOOTER}>
      {children}
    </DialogFooterRoot>
  );
}

const DialogFooterRoot = styled.div`
  display: flex;
`;
