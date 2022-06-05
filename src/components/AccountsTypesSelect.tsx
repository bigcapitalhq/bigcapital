import React, { useCallback } from 'react';
import classNames from 'classnames';
import { ListSelect } from 'components';
import { CLASSES } from 'common/classes';

export default function AccountsTypesSelect({
  accountsTypes,
  selectedTypeId,
  defaultSelectText = 'Select account type',
  onTypeSelected,
  disabled = false,
  popoverFill = false,
  ...restProps
}) {
  // Filters accounts types items.
  const filterAccountTypeItems = (query, accountType, _index, exactMatch) => {
    const normalizedTitle = accountType.label.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  };

  // Handle item selected.
  const handleItemSelected = (accountType) => {
    onTypeSelected && onTypeSelected(accountType);
  };

  return (
    <ListSelect
      items={accountsTypes}
      selectedItemProp={'key'}
      selectedItem={selectedTypeId}
      textProp={'label'}
      defaultText={defaultSelectText}
      onItemSelect={handleItemSelected}
      itemPredicate={filterAccountTypeItems}
      disabled={disabled}
      className={classNames('form-group--select-list', {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      {...restProps}
    />
  );
}
