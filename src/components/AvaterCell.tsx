// @ts-nocheck
import React from 'react';
import { firstLettersArgs } from '@/utils';

export default function AvatarCell({ row: { original }, size }) {
  return (
    <span className="avatar" data-size={size}>
      {firstLettersArgs(original?.display_name)}
    </span>
  );
}
