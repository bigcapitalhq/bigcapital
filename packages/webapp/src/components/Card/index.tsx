import React from 'react';
import styled from 'styled-components';
import { NS } from '@/constants/classes';

interface CardProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Card({ className, style, children }: CardProps) {
  return (
    <CardRoot className={className} style={style}>
      {children}
    </CardRoot>
  );
}

const CardRoot = styled.div`
  padding: 15px;
  margin: 15px;
  background: var(--color-card-background);
  border: 1px solid var(--color-card-border);
`;

export const CardFooterActions = styled.div`
  --x-color-border: #e0e7ea;

  .${NS}-dark & {
    --x-color-border: rgba(255, 255, 255, 0.15);
  }
  padding-top: 16px;
  border-top: 1px solid var(--x-color-border);
  margin-top: 30px;

  .${NS}-button {
    min-width: 70px;

    + .${NS}-button {
      margin-left: 10px;
    }
  }
`;
