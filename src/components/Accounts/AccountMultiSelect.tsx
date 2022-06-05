import React from 'react';
import styled from 'styled-components';
import { MenuItem } from '@blueprintjs/core';
import { FMultiSelect } from '../Forms';
import classNames from 'classnames';
import { Classes } from '@blueprintjs/popover2';

/**
 *
 * @param {*} query
 * @param {*} account
 * @param {*} _index
 * @param {*} exactMatch
 * @returns
 */
const accountItemPredicate = (query, account, _index, exactMatch) => {
  const normalizedTitle = account.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${account.code}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};

/**
 *
 * @param {*} account
 * @param {*} param1
 * @returns
 */
const accountItemRenderer = (
  account,
  { handleClick, modifiers, query },
  { isSelected },
) => {
  return (
    <MenuItem
      icon={isSelected ? 'tick' : 'blank'}
      text={account.name}
      label={account.code}
      key={account.id}
      onClick={handleClick}
    />
  );
};

const accountSelectProps = {
  itemPredicate: accountItemPredicate,
  itemRenderer: accountItemRenderer,
  valueAccessor: (item) => item.id,
  labelAccessor: (item) => item.code,
  tagRenderer: (item) => item.name,
};

/**
 * branches mulit select.
 * @param {*} param0
 * @returns {JSX.Element}
 */
export function AccountMultiSelect({ accounts, ...rest }) {
  return (
    <FMultiSelect
      items={accounts}
      popoverProps={{
        minimal: true,
      }}
      {...accountSelectProps}
      {...rest}
    />
  );
}
