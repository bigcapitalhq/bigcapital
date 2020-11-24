import React, { useCallback, useMemo } from 'react';
import ItemsListField from 'components/ItemsListField';
import classNames from 'classnames';
import { FormGroup, Classes, Intent } from '@blueprintjs/core';


export default function ItemsListCell({
  column: { id, filterSellable, filterPurchasable },
  row: { index },
  cell: { value: initialValue },
  payload: { items, updateData, errors },
}) {
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
      <ItemsListField
        items={items}
        onItemSelected={handleItemSelected}
        selectedItemId={initialValue}
        sellable={filterSellable}
        purchasable={filterPurchasable}
      />
    </FormGroup>
  );
}
