import React, { useCallback, useMemo } from 'react';
import ItemListField from 'components/ItemListField';
import classNames from 'classnames';
import { FormGroup, Classes, Intent } from '@blueprintjs/core';


function ItemsListCell({
  column: { id },
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
      <ItemListField
        items={items}
        onItemSelected={handleItemSelected}
        selectedItemId={initialValue}
      />
    </FormGroup>
  );
}

export default ItemsListCell;
