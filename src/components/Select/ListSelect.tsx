// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { FormattedMessage as T } from '../FormattedMessage';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

export function ListSelect({
  buttonProps,
  defaultText,
  noResultsText = <T id="no_results" />,
  isLoading = false,
  textProp,
  labelProp,

  selectedItem,
  selectedItemProp = 'id',

  initialSelectedItem,
  onItemSelect,
  disabled = false,
  ...selectProps
}) {
  const selectedItemObj = useMemo(
    () => selectProps.items.find((i) => i[selectedItemProp] === selectedItem),
    [selectProps.items, selectedItemProp, selectedItem],
  );

  const selectedInitialItem = useMemo(
    () =>
      selectProps.items.find(
        (i) => i[selectedItemProp] === initialSelectedItem,
      ),
    [initialSelectedItem],
  );

  const [currentItem, setCurrentItem] = useState(
    (initialSelectedItem && selectedInitialItem) || null,
  );

  useEffect(() => {
    if (selectedItemObj) {
      setCurrentItem(selectedItemObj);
    }
  }, [selectedItemObj, setCurrentItem]);

  const noResults = isLoading ? (
    'loading'
  ) : (
    <MenuItem disabled={true} text={noResultsText} />
  );

  const itemRenderer = (item, { handleClick, modifiers, query }) => {
    return (
      <MenuItem
        text={item[textProp]}
        key={item[selectedItemProp]}
        label={item[labelProp]}
        onClick={handleClick}
      />
    );
  };

  const handleItemSelect = (_item) => {
    setCurrentItem(_item);
    onItemSelect && onItemSelect(_item);
  };

  // Filters accounts types items.
  const filterItems = (query, item, _index, exactMatch) => {
    const normalizedTitle = item[textProp].toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  };

  return (
    <Select
      itemRenderer={itemRenderer}
      onItemSelect={handleItemSelect}
      itemPredicate={filterItems}
      {...selectProps}
      noResults={noResults}
      disabled={disabled}
      className={classNames(
        CLASSES.FORM_GROUP_LIST_SELECT,
        selectProps.className,
      )}
    >
      <Button
        text={currentItem ? currentItem[textProp] : defaultText}
        loading={isLoading}
        disabled={disabled}
        {...buttonProps}
        fill={true}
      />
    </Select>
  );
}
