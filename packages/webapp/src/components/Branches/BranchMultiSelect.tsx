// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { MenuItem } from '@blueprintjs/core';
import { FMultiSelect } from '../Forms';

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
 * @param {*} branch
 * @param {*} param1
 * @returns
 */
const branchItemRenderer = (
  branch,
  { handleClick, modifiers, query },
  { isSelected },
) => {
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      icon={isSelected ? 'tick' : 'blank'}
      text={branch.name}
      label={branch.code}
      key={branch.id}
      onClick={handleClick}
    />
  );
};

const branchSelectProps = {
  itemPredicate: branchItemPredicate,
  itemRenderer: branchItemRenderer,
  valueAccessor: (item) => item.id,
  labelAccessor: (item) => item.code,
  tagRenderer: (item) => item.name,
};

/**
 * branches multi select.
 * @param {*} param0
 * @returns {JSX.Element}
 */
export function BranchMultiSelect({ branches, ...rest }) {
  return (
    <FMultiSelect
      items={branches}
      placeholder={intl.get('branches_multi_select.placeholder')}
      popoverProps={{ minimal: true }}
      {...branchSelectProps}
      {...rest}
    />
  );
}
