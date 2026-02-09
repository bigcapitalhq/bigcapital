// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

export function TextStatus({ intent, children }) {
  return <TextStatusRoot intent={intent}>{children}</TextStatusRoot>;
}

const TextStatusRoot = styled.span`
  ${(props) =>
    props.intent === 'warning' &&
    `
  color: #c87619;`}

  ${(props) =>
    props.intent === 'danger' &&
    `
  color: #f17377;`}

  ${(props) =>
    props.intent === 'success' &&
    `
  color: #238551;`}

  ${(props) =>
    props.intent === 'none' &&
    `
  color: #777;`}

  ${(props) =>
    props.intent === 'primary' &&
    `
  color: #1652c8;`}
`;
