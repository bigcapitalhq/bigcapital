// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Spinner } from '@blueprintjs/core';
import { Button } from '@blueprintjs/core';

export function AuthenticationLoadingOverlay() {
  return (
    <AuthOverlayRoot>
      <Spinner size={50} />
    </AuthOverlayRoot>
  );
}

const AuthOverlayRoot = styled.div`
  --x-color-background: rgba(252, 253, 255, 0.5);

  .bp4-dark & {
    --x-color-background: rgba(37, 42, 49, 0.60);
  }
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--x-color-background);
  display: flex;
  justify-content: center;
`;

export const AuthInsiderContent = styled.div`
  position: relative;
`;
export const AuthInsiderCard = styled.div`
  --x-color-background: #fff;
  --x-color-border: #d5d5d5;

  .bp4-dark & {
    --x-color-background: var(--color-dark-gray2);
    --x-color-border: rgba(255, 255, 255, 0.1);
  }
  border: 1px solid var(--x-color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 26px 22px;
  background: var(--x-color-background);
  border-radius: 3px;
`;

export const AuthInsiderCopyright = styled.div`
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 1.2rem;

  .bp4-icon-bigcapital {
    svg {
      path {
        fill: #a3a3a3;
      }
    }
  }
`;

export const AuthFooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
  margin-top: 1rem;
`;

export const AuthFooterLink = styled.p`
  --x-color-text: #666;

  .bp4-dark & {
    --x-color-text: rgba(255, 255, 255, 0.75);
  }
  color: var(--x-color-text);
  margin: 0;
`;

export const AuthSubmitButton = styled(Button)`
  margin-top: 20px;

  &.bp4-intent-primary {
    // background-color: #0052cc;

    &:disabled,
    &.bp4-disabled {
      // background-color: rgba(0, 82, 204, 0.4);
    }
  }
`;
