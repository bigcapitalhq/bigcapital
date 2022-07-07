import React from 'react';
import classNames from 'classnames';
import ItemsEntriesTable from '@/containers/Entries/ItemsEntriesTable';
import { FastField } from 'formik';
import { CLASSES } from '@/common/classes';
import { useBillFormContext } from './BillFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import { ITEM_TYPE } from '@/containers/Entries/utils';

/**
 * Bill form body. 
 */
export default function BillFormBody({ defaultBill }) {
  const { items } = useBillFormContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
      <FastField
        name={'entries'}
        items={items}
        shouldUpdate={entriesFieldShouldUpdate}
      >
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <ItemsEntriesTable
            entries={value}
            onUpdateData={(entries) => {
              setFieldValue('entries', entries);
            }}
            items={items}
            errors={error}
            linesNumber={4}
            currencyCode={values.currency_code}
            itemType={ITEM_TYPE.PURCHASABLE}
            landedCost={true}
          />
        )}
      </FastField>
    </div>
  );
}
