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
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(252, 253, 255, 0.5);
  display: flex;
  justify-content: center;
`;

export const AuthInsiderContent = styled.div`
  position: relative;
`;
export const AuthInsiderCard = styled.div`
  border: 1px solid #d5d5d5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 26px 22px;
  background: #ffff;
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
  color: #666;
  margin: 0;
`;

export const AuthSubmitButton = styled(Button)`
  margin-top: 20px;

  &.bp4-intent-primary {
    background-color: #0052cc;

    &:disabled,
    &.bp4-disabled {
      background-color: rgba(0, 82, 204, 0.4);
    }
  }
`;
