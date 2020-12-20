import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import EditableItemsEntriesTable from 'containers/Entries/EditableItemsEntriesTable';

export default function ExpenseFormBody({ defaultReceipt }) {
  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <EditableItemsEntriesTable
        defaultEntry={defaultReceipt}
        filterSellableItems={true}
      />
    </div>
  );
}
