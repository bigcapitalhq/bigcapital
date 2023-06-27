// @ts-nocheck
import React, { useCallback } from 'react';
import classNames from 'classnames';
import { FormGroup, Classes, Intent } from '@blueprintjs/core';

import { PaymentReceiveListField } from '@/components';
import { CellType } from '@/constants';
function PaymentReceiveListFieldCell({
  column: { id },
  row: { index },
  cell: { value: initialValue },
  payload: { invoices, updateData, errors },
}) {
  const handleInvoicesSelected = useCallback(
    (_item) => {
      updateData(index, id, _item.id);
    },
    [updateData, index, id],
  );

  const error = errors?.[index]?.[id];

  return (
    <FormGroup
      intent={error ? Intent.DANGER : null}
      className={classNames('form-group--select-list', Classes.FILL)}
    >
      <PaymentReceiveListField
        invoices={invoices}
        onInvoiceSelected={handleInvoicesSelected}
        selectedInvoiceId={initialValue}
      />
    </FormGroup>
  );
}

PaymentReceiveListFieldCell.cellType = CellType.Field;

export default PaymentReceiveListFieldCell;
