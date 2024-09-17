// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

export function Card({ className, style, children }) {
  return (
    <CardRoot className={className} style={style}>
      {children}
    </CardRoot>
  );
}

const CardRoot = styled.div`
  padding: 15px;
  margin: 15px;
  background: #fff;
  border: 1px solid #d2dce2;
`;

export const CardFooterActions = styled.div`
  padding-top: 16px;
  border-top: 1px solid #e0e7ea;
  margin-top: 30px;

  .bp4-button {
    min-width: 70px;

    + .bp4-button {
      margin-left: 10px;
    }
  }
`;
