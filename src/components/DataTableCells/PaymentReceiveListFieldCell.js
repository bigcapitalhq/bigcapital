import React, { useCallback } from 'react';
import PaymentReceiveListField from 'components/PaymentReceiveListField';
import classNames from 'classnames';
import { FormGroup, Classes, Intent } from '@blueprintjs/core';

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
      className={classNames('form-group--selcet-list', Classes.FILL)}
    >
      <PaymentReceiveListField
        invoices={invoices}
        onInvoiceSelected={handleInvoicesSelected}
        selectedInvoiceId={initialValue}
      />
    </FormGroup>
  );
}

export default PaymentReceiveListFieldCell;
