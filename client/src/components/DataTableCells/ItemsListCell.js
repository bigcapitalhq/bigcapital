import React, { useCallback, useRef } from 'react';
// import ItemsListField from 'components/ItemsListField';
import ItemsSuggestField from 'components/ItemsSuggestField';
import classNames from 'classnames';

import { FormGroup, Classes, Intent } from '@blueprintjs/core';

import { useCellAutoFocus } from 'hooks';

export default function ItemsListCell({
  column: { id, filterSellable, filterPurchasable },
  row: { index },
  cell: { value: initialValue },
  payload: { items, updateData, errors, autoFocus },
}) {
  const fieldRef = useRef();

  // Auto-focus the items list input field.
  useCellAutoFocus(fieldRef, autoFocus, id, index);

  const handleItemSelected = useCallback(
    (item) => {
      updateData(index, id, item.id);
    },
    [updateData, index, id],
  );

  const error = errors?.[index]?.[id];

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames('form-group--select-list', Classes.FILL)}
    >
      <ItemsSuggestField
        items={items}
        onItemSelected={handleItemSelected}
        selectedItemId={initialValue}
        sellable={filterSellable}
        purchasable={filterPurchasable}
        inputProps={{
          inputRef: (ref) => (fieldRef.current = ref),
        }}
        openOnKeyDown={true}
        blurOnSelectClose={false}
      />
    </FormGroup>
  );
}
