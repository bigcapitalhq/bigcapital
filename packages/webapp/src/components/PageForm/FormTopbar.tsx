// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Navbar } from '@blueprintjs/core';

/**
 * Form the topbar.
 * @param   {JSX.Element} children
 * @returns {JSX.Element}
 */
export function FormTopbar({ className, children }) {
  return <FormTopBarRoot className={className}>{children}</FormTopBarRoot>;
}

const FormTopBarRoot = styled(Navbar)`
  box-shadow: 0 0 0;
  border-bottom: 1px solid #c7d5db;
  height: 35px;
  padding: 0 20px;

  .bp4-navbar-group {
    height: 35px;
  }
  .bp4-navbar-divider {
    border-left-color: #d2dce2;
  }
  .bp4-skeleton {
    max-height: 10px;
  }
  .bp4-button {
    &:hover {
      background: rgba(167, 182, 194, 0.12);
      color: #32304a;
    }
  }
`;

export const DetailsBarSkeletonBase = styled.div`
  letter-spacing: 10px;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 8px;
  width: 140px;
  height: 10px;
`;
