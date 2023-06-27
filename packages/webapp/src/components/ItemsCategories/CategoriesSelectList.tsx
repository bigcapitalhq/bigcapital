// @ts-nocheck
import React, { useCallback } from 'react';
import { FormattedMessage as T } from '@/components';
import { ListSelect } from '@/components';
import { MenuItem } from '@blueprintjs/core';
import { saveInvoke } from '@/utils';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

export function CategoriesSelectList({
  categories,
  selectedCategoryId,
  defaultSelectText = <T id={'select_category'} />,
  onCategorySelected,
  popoverFill = false,
  className,
  ...restProps
}) {
  // Filter Items Category
  const filterItemCategory = (query, item, _index, exactMatch) => {
    const normalizedTitle = item.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return `${item.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
  };

  const handleItemCategorySelected = useCallback(
    (ItemCategory) => saveInvoke(onCategorySelected, ItemCategory),
    [onCategorySelected],
  );

  const categoryItem = useCallback(
    (item, { handleClick }) => (
      <MenuItem key={item.id} text={item.name} onClick={handleClick} />
    ),
    [],
  );

  return (
    <ListSelect
      items={categories}
      selectedItemProp={'id'}
      selectedItem={selectedCategoryId}
      textProp={'name'}
      defaultText={defaultSelectText}
      onItemSelect={handleItemCategorySelected}
      itemPredicate={filterItemCategory}
      itemRenderer={categoryItem}
      popoverProps={{ minimal: true, usePortal: !popoverFill }}
      className={classNames(
        'form-group--select-list',
        {
          [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
        },
        className,
      )}
      {...restProps}
    />
  );
}
