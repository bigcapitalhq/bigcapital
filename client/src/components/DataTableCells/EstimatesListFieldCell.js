import React, { useCallback, useMemo } from 'react';
import EstimateListField from 'components/EstimateListField';
import classNames from 'classnames';
import { FormGroup, Classes, Intent } from '@blueprintjs/core';

function EstimatesListFieldCell({
  column: { id },
  row: { index },
  cell: { value: initialValue },
  payload: { products, updateData, errors },
}) {
  const handleProductSelected = useCallback(
    (item) => {
      updateData(index, id, item.id);
    },
    [updateData, index, id],
  );

  const error = errors?.[index]?.[id];

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames(
        'form-group--select-list',
        Classes.FILL,
      )}
    >
      <EstimateListField
        products={products}
        onProductSelected={handleProductSelected}
        selectedProductId={initialValue}
      />
    </FormGroup>
  );
}

export default EstimatesListFieldCell;
