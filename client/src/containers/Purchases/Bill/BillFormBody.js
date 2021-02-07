import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import EditableItemsEntriesTable from 'containers/Entries/EditableItemsEntriesTable';
import { useBillFormContext } from './BillFormProvider';

export default function BillFormBody({ defaultBill }) {
  const { items } = useBillFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <EditableItemsEntriesTable
        items={items}
        defaultEntry={defaultBill}
        filterPurchasableItems={true}
      />
    </div>
  );
}
