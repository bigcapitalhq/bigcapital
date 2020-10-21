import React, { useCallback } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { ListSelect } from 'components';
import { MenuItem } from '@blueprintjs/core';

export default function CategoriesSelectList({
  categoriesList,
  selecetedCategoryId,
  defaultSelectText = <T id={'select_category'} />,
  onCategorySelected,
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
    (ItemCategory) => onCategorySelected && onCategorySelected(ItemCategory),
    [],
  );
  const categoryItem = useCallback(
    (item, { handleClick }) => (
      <MenuItem key={item.id} text={item.name} onClick={handleClick} />
    ),
    [],
  );

  return (
    <ListSelect
      items={categoriesList}
      selectedItemProp={'id'}
      selectedItem={selecetedCategoryId}
      labelProp={'name'}
      defaultText={defaultSelectText}
      onItemSelect={handleItemCategorySelected}
      itemPredicate={filterItemCategory}
      itemRenderer={categoryItem}
      {...restProps}
    />
  );
}
