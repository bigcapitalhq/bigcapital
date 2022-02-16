import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { MultiSelect as FMultiSelect } from 'blueprint-formik';

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
    return `${branch.name}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

/**
 *
 * @param {*} branch
 * @param {*} param1
 * @returns
 */
const branchItemRenderer = (
  branch,
  { handleClick, modifiers, query },
  { isSelected },
) => {
  const text = `${branch.name}.${isSelected ? 'selected' : 'not-selected'}`;

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      icon={modifiers.selected ? 'tick' : 'blank'}
      label={branch.name.toString()}
      key={branch.id}
      onClick={handleClick}
      text={text}
    />
  );
};

const branchSelectProps = {
  itemPredicate: branchItemPredicate,
  itemRenderer: branchItemRenderer,
  valueAccessor: (item) => item.id,
  labelAccessor: (item) => item.label,
  tagRenderer: (item) => item.name,
};

export function BranchesMultiSelect({ branches, ...rest }) {
  return <FMultiSelect items={branches} {...branchSelectProps} {...rest} />;
}
