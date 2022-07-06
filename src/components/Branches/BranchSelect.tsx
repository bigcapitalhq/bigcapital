import React from 'react';

import { MenuItem, Button } from '@blueprintjs/core';
import { FSelect } from '@/components';

/**
 *
 * @param {*} query
 * @param {*} branch
 * @param {*} _index
 * @param {*} exactMatch
 * @returns
 */
const branchItemPredicate = (query, branch, _index, exactMatch) => {
  const normalizedTitle = branch.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${branch.code}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

/**
 *
 * @param {*} film
 * @param {*} param1
 * @returns
 */
const branchItemRenderer = (branch, { handleClick, modifiers, query }) => {
  const text = `${branch.name}`;

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={branch.code}
      key={branch.id}
      onClick={handleClick}
      text={text}
    />
  );
};

const branchSelectProps = {
  itemPredicate: branchItemPredicate,
  itemRenderer: branchItemRenderer,
  valueAccessor: 'id',
  labelAccessor: 'name',
};

/**
 *
 * @param {*} param0
 * @returns
 */
export function BranchSelect({ branches, ...rest }) {
  return <FSelect {...branchSelectProps} {...rest} items={branches} />;
}

/**
 *
 * @param {*} param0
 * @returns
 */
export function BranchSelectButton({ label, ...rest }) {
  return <Button text={label} {...rest} />;
}
