import React, { useMemo, useCallback } from 'react';
import { CloudLoadingIndicator } from 'components';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { DataTableEditable } from 'components';
import { usePaymentMadeEntriesTableColumns } from './components';

import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';

/**
 * Payment made items table.
 */
export default function PaymentMadeItemsTable() {
  const {
    paymentVendorId,
    dueBills,
    isDueBillsFetching,
    isNewMode,
  } = usePaymentMadeFormContext();

  const columns = usePaymentMadeEntriesTableColumns();

  // Detarmines takes vendor payable bills entries in create mode
  // or payment made entries in edit mode.
  const computedTableEntries = useMemo(() => [], []);

  // Triggers `onUpdateData` event that passes changed entries.
  const triggerUpdateData = useCallback((entries) => {}, []);

  const triggerOnFetchBillsSuccess = useCallback((bills) => {}, []);

  // Handle update data.
  const handleUpdateData = useCallback((rows) => {}, []);

  // Detarmines the right no results message before selecting vendor and aftering
  // selecting vendor id.
  const noResultsMessage = paymentVendorId
    ? 'There is no payable bills for this vendor that can be applied for this payment'
    : 'Please select a vendor to display all open bills for it.';

  return (
    <CloudLoadingIndicator isLoading={isDueBillsFetching}>
      <DataTableEditable
        progressBarLoading={isDueBillsFetching}
        className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
        columns={columns}
        data={[]}
        spinnerProps={false}
        payload={{
          errors: [],
          updateData: handleUpdateData,
        }}
        noResults={noResultsMessage}
        actions={
          <Button
            small={true}
            className={'button--secondary button--clear-lines'}
            // onClick={handleClickClearAllLines}
          >
            <T id={'clear_all_lines'} />
          </Button>
        }
        totalRow={true}
      />
    </CloudLoadingIndicator>
  );
}
