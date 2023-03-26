// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

export function Paper({ children, className }) {
  return <PaperRoot className={className}>{children}</PaperRoot>;
}

const PaperRoot = styled.div`
  border: 1px solid #d2dce2;
  background: #fff;
  padding: 10px;
`;
