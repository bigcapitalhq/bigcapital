// @ts-nocheck
import React from 'react';
import clsx from 'classnames';
import styled from 'styled-components';

export function Alert({ title, description, children, intent, className }) {
  return (
    <AlertRoot className={clsx(className)} intent={intent}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDesc>{description}</AlertDesc>}
      {children && <AlertDesc>{children}</AlertDesc>}
    </AlertRoot>
  );
}

const AlertRoot = styled.div`
  border: 1px solid rgb(223, 227, 230);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;

  ${(props) =>
    props.intent === 'danger' &&
    `
    border-color: rgb(249, 198, 198);
    background: rgb(255, 248, 248);

    ${AlertDesc} {
      color: #d95759;
    }
    ${AlertTitle} {
      color: rgb(205, 43, 49);
    }
  `}

  ${(props) =>
    props.intent === 'primary' &&
    `
    background: #fff;
    border-color: #98a8ee;

    ${AlertTitle} {
      color: #1a3bd4;
    }
    ${AlertDesc} {
      color: #455883;
    }
  `}
`;

export const AlertTitle = styled.h3`
  color: rgb(17, 24, 28);
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
`;

export const AlertDesc = styled.p`
  color: rgb(104, 112, 118);
  margin: 0;
`;
