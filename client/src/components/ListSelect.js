import React, { useState, useMemo, useEffect } from 'react';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { FormattedMessage as T } from 'react-intl';

export default function ListSelect({
  buttonProps,
  defaultText,
  noResultsText = <T id="no_results" />,
  isLoading = false,
  labelProp,

  selectedItem,
  selectedItemProp = 'id',

  initialSelectedItem,
  onItemSelect,

  ...selectProps
}) {
  const selectedItemObj = useMemo(
    () => selectProps.items.find((i) => i[selectedItemProp] === selectedItem),
    [selectProps.items, selectedItemProp, selectedItem],
  );

  const selectedInitialItem = useMemo(
    () => selectProps.items.find((i) => i[selectedItemProp] === initialSelectedItem),
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
        text={item[labelProp]}
        key={item[selectedItemProp]}
        onClick={handleClick}
      />
    );
  };

  const handleItemSelect = (_item) => {
    setCurrentItem(_item);
    onItemSelect && onItemSelect(_item);
  };

  return (
    <Select
      itemRenderer={itemRenderer}
      onItemSelect={handleItemSelect}
      {...selectProps}
      noResults={noResults}
    >
      <Button
        text={currentItem ? currentItem[labelProp] : defaultText}
        loading={isLoading}
        {...buttonProps}
      />
    </Select>
  );
}
