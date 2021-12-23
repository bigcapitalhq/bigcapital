import React from 'react';
import styled from 'styled-components';

export default function Card({ className, children }) {
  return <CardRoot className={className}>{children}</CardRoot>;
}

const CardRoot = styled.div`
  padding: 15px;
  margin: 15px;
  background: #fff;
  border: 1px solid #d2dce2;
`;
