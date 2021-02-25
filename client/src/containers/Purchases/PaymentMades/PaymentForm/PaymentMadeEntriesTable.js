import React, { useMemo, useCallback } from 'react';
import { CloudLoadingIndicator } from 'components';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { DataTableEditable } from 'components';
import { usePaymentMadeEntriesTableColumns } from './components';

import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import { compose, updateTableRow, safeSumBy } from 'utils';
import withAlertActions from 'containers/Alert/withAlertActions';

/**
 * Payment made items table.
 */
function PaymentMadeEntriesTable({
  onUpdateData,
  entries,

  // #withAlertsActions
  openAlert,
}) {
  const { paymentVendorId, isDueBillsFetching } = usePaymentMadeFormContext();

  const columns = usePaymentMadeEntriesTableColumns();

  // Handle update data.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(updateTableRow(rowIndex, columnId, value))(
        entries,
      );

      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );

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
        data={entries}
        spinnerProps={false}
        payload={{
          errors: [],
          updateData: handleUpdateData,
        }}
        noResults={noResultsMessage}
        footer={true}
      />
    </CloudLoadingIndicator>
  );
}

export default compose(withAlertActions)(PaymentMadeEntriesTable);
