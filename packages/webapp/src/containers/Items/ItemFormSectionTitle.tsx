import React from 'react';
import { css } from '@emotion/css';

const itemFormSectionTitleClass = css`
  font-size: 14px;
  color: #8f99a8;
  margin-bottom: 18px;
  margin-top: 10px;
`;

export function ItemFormSectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h4 className={itemFormSectionTitleClass}>{children}</h4>;
}
