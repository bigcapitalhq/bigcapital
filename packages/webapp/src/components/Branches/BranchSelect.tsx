// @ts-nocheck
import React from 'react';

import { MenuItem, Button } from '@blueprintjs/core';
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

/**
 *
 * @param {*} param0
 * @returns
 */
export function BranchSelectButton({ label, ...rest }) {
  return <Button text={label} {...rest} />;
}
