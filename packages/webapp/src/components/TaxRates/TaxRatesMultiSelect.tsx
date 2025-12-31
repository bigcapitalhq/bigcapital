// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import intl from 'react-intl-universal';
import { MenuItem, Tag } from '@blueprintjs/core';
import { FMultiSelect } from '@/components/Forms';
import { DialogsName } from '@/constants/dialogs';
import withDialogActions from '@/containers/Dialog/withDialogActions';

// Create new tax rate renderer.
const createNewItemRenderer = (query, active, handleClick) => {
  return (
    <MenuItem
      icon="add"
      text={intl.get('list.create', { value: `"${query}"` })}
      active={active}
      onClick={handleClick}
    />
  );
};

// Create new item from the given query string.
const createNewItemFromQuery = (name) => ({ name });

/**
 * Custom tag renderer for tax rates with rate percentage.
 */
const tagRenderer = (item) => {
  if (!item) return null;
  return `${item.name} [${item.rate}%]`;
};

/**
 * Custom item renderer for tax rates with compound indicator.
 */
const itemRenderer = (item, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  const label = item.is_compound ? '(Compound)' : '';

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={item.id}
      onClick={handleClick}
      text={`${item.name} [${item.rate}%]`}
      label={label}
    />
  );
};

/**
 * Item predicate for filtering tax rates.
 */
const itemPredicate = (query, item) => {
  const normalizedQuery = query.toLowerCase();
  const normalizedName = item.name?.toLowerCase() || '';
  const normalizedCode = item.code?.toLowerCase() || '';

  return (
    normalizedName.includes(normalizedQuery) ||
    normalizedCode.includes(normalizedQuery)
  );
};

/**
 * Tax rates multi-select component.
 * Allows selecting multiple tax rates for an item entry.
 * @returns {JSX.Element}
 */
function TaxRatesMultiSelectRoot({
  // #withDialogActions
  openDialog,

  // #ownProps
  allowCreate,
  items,
  selectedItems = [],
  onItemSelect,
  onItemRemove,
  ...restProps
}) {
  // Maybe inject new item props to select component.
  const maybeCreateNewItemRenderer = allowCreate ? createNewItemRenderer : null;
  const maybeCreateNewItemFromQuery = allowCreate
    ? createNewItemFromQuery
    : null;

  // Handles the create item click.
  const handleCreateItemClick = () => {
    openDialog(DialogsName.TaxRateForm);
  };

  return (
    <FMultiSelect
      items={items}
      selectedItems={selectedItems}
      valueAccessor={'id'}
      textAccessor={'name_formatted'}
      labelAccessor={'code'}
      tagAccessor={'name'}
      tagRenderer={tagRenderer}
      itemRenderer={itemRenderer}
      itemPredicate={itemPredicate}
      fill={true}
      popoverProps={{ minimal: true, usePortal: true }}
      resetOnSelect={true}
      createNewItemRenderer={maybeCreateNewItemRenderer}
      createNewItemFromQuery={maybeCreateNewItemFromQuery}
      onCreateItemSelect={handleCreateItemClick}
      onItemSelect={onItemSelect}
      onRemove={onItemRemove}
      {...restProps}
    />
  );
}

export const TaxRatesMultiSelect = R.compose(withDialogActions)(
  TaxRatesMultiSelectRoot,
);
