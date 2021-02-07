import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import EditableItemsEntriesTable from 'containers/Entries/EditableItemsEntriesTable';
import { useReceiptFormContext } from './ReceiptFormProvider';

export default function ExpenseFormBody({ defaultReceipt }) {
  const { items } = useReceiptFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <EditableItemsEntriesTable
        items={items}
        defaultEntry={defaultReceipt}
        filterSellableItems={true}
      />
    </div>
  );
}
