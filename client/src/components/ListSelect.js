import React, { useState, useEffect } from 'react';
import {
  Button,
  MenuItem,
} from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { FormattedMessage as T } from 'react-intl';

export default function ListSelect ({
  buttonProps,
  defaultText,
  noResultsText = (<T id="no_results" />),
  isLoading = false,
  labelProp,

  selectedItem,
  selectedItemProp = 'id',
  ...selectProps
}) {
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (selectedItem && selectedItemProp) {
      const item = selectProps.items.find(i => i[selectedItemProp] === selectedItem);
      setCurrentItem(item);
    }
  }, [selectedItem, selectedItemProp, selectProps.items]);

  const noResults = isLoading ?
    ('loading') : <MenuItem disabled={true} text={noResultsText} />;

  return (
    <Select
      {...selectProps}
      noResults={noResults}
    >
      <Button
        text={currentItem ? currentItem[labelProp] : defaultText}
        loading={isLoading}
        {...buttonProps}
      />
    </Select>
  )
}