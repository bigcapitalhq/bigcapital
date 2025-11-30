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
  --color-form-topbar-background: #fff;
  --color-form-topbar-border: #c7d5db;
  --color-divider-color: #d2dce2;

  .bp4-dark & {
    --color-form-topbar-background: var(--color-dark-gray1);
    --color-form-topbar-border: rgba(255, 255, 255, 0.15);
    --color-divider-color: rgba(255, 255, 255, 0.25);
  }
  height: 35px;
  padding: 0 20px;

  &,
  .bp4-dark & {
    border-bottom: 1px solid var(--color-form-topbar-border);
    background-color: var(--color-form-topbar-background);
    box-shadow: 0 0 0;
  }

  .bp4-navbar-group {
    height: 35px;
  }
  .bp4-navbar-divider {
    border-left-color: var(--color-divider-color);
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
