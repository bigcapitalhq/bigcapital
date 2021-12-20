import React from 'react';
import clsx from 'classnames';
import styled from 'styled-components';

export default function Card({ className, children }) {
  return <CardRoot className={clsx('card', className)}>{children}</CardRoot>;
}

const CardRoot = styled.div`
  padding: 15px;
`;
