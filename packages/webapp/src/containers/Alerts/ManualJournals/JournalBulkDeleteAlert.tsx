// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from '@/components';

import { useBulkDeleteManualJournals } from '@/hooks/query/manualJournals';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Manual journal bulk delete alert.
 */
function JournalBulkDeleteAlert({
  name,
  isOpen,
  payload: { journalsIds },
  closeAlert,
}) {
  const { mutateAsync: bulkDeleteManualJournals, isLoading } = useBulkDeleteManualJournals();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirmBulkDelete = () => {
    bulkDeleteManualJournals(journalsIds)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_journals_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('manual-journals-table');
        closeAlert(name);
      })
      .catch((errors) => {
        // Handle errors
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={
        <T id={'delete_count'} values={{ count: journalsIds?.length || 0 }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmBulkDelete}
      loading={isLoading}
    >
      <p>
        <T id={'once_delete_these_journals_you_will_not_able_restore_them'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(JournalBulkDeleteAlert);
