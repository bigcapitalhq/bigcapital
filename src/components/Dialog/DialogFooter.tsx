// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Classes } from '@blueprintjs/core';

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
