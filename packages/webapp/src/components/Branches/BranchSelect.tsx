// @ts-nocheck
import { MenuItem, Button } from '@blueprintjs/core';
import React from 'react';
import { FSelect } from '../Forms';

/**
 * Branch select field.
 * @param {*} param0
 * @returns {JSX.Element}
 */
export function BranchSelect({ branches, ...rest }) {
  return (
    <FSelect
      valueAccessor={'id'}
      textAccessor={'name'}
      labelAccessor={'code'}
      {...rest}
      items={branches}
    />
  );
}
