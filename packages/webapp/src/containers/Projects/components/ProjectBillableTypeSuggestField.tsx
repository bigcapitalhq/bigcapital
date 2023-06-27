// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Menu, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { FormattedMessage as T } from '@/components';

import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

/**
 * @param {*} billableType
 * @param {*} param1
 * @returns {JSX.Element}
 */
const billableTypeItemRenderer = (
  billableType,
  { handleClick, modifiers, query },
) => {
  return (
    <MenuItem
      disabled={modifiers.disabled}
      key={billableType.id}
      text={billableType.name}
      onClick={handleClick}
    />
  );
};

/**
 *
 * @param {*} query
 * @param {*} billableType
 * @param {*} _index
 * @param {*} exactMatch
 * @returns
 */
const billableTypeItemPredicate = (query, billableType, _index, exactMatch) => {
  const normalizedTitle = billableType.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return (
      `${billableType.name}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0
    );
  }
};

/**
 *
 * @param inputValue
 * @returns
 */
const billableTypeInputValueRenderer = (inputValue) => {
  if (inputValue) {
    return inputValue.name.toString();
  }
  return '';
};

/**
 * Project billable type suggest field.
 * @param
 */
export function ProjectBillableTypeSuggestField({
  billableType,
  initialBillableTypeId,
  selectedBillableTypeId,

  defaultSelectText = 'Placeholder Type...',
  onBillableTypeSelected,
  popoverFill = false,

  ...suggestProps
}) {
  const initialBillableType = React.useMemo(
    () => billableType.find((b) => b.id === initialBillableTypeId),
    [initialBillableTypeId, billableType],
  );

  const [selectedBillableType, setSelectedBillableType] = React.useState(
    initialBillableType || null,
  );

  React.useEffect(() => {
    if (typeof selectedBillableTypeId !== 'undefined') {
      const billableType = selectedBillableTypeId
        ? billableType.find((a) => a.id === selectedBillableTypeId)
        : null;
      setSelectedBillableType(billableType);
    }
  }, [selectedBillableTypeId, billableType, setSelectedBillableType]);

  /**
   *
   * @param {*} billableType
   * @returns
   */
  const billableTypetemSelect = React.useCallback(
    (billableType) => {
      if (billableType.id) {
        setSelectedBillableType({ ...billableType });
        onBillableTypeSelected && onBillableTypeSelected(billableType);
      }
    },
    [setSelectedBillableType, onBillableTypeSelected],
  );

  const billableTypeSelectProps = {
    itemRenderer: billableTypeItemRenderer,
    itemPredicate: billableTypeItemPredicate,
    inputValueRenderer: billableTypeInputValueRenderer,
  };
  return (
    <Suggest
      items={billableType}
      selectedItem={selectedBillableType}
      onItemSelect={billableTypetemSelect}
      inputProps={{ placeholder: defaultSelectText }}
      fill={true}
      resetOnClose={true}
      popoverProps={{ minimal: true, boundary: 'window' }}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      {...billableTypeSelectProps}
      {...suggestProps}
    />
  );
}
