import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { compose, saveInvoke } from '@/utils';

interface ItemsEntriesDeleteAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: Record<string, never>;
  onConfirm?: (event?: unknown) => void;
}

function ItemsEntriesDeleteAlertInner({
  name,
  isOpen,
  onConfirm,
  closeAlert,
}: ItemsEntriesDeleteAlertProps): React.ReactElement {
  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirm = (event: unknown) => {
    closeAlert(name);
    saveInvoke(onConfirm, event);
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('clear_all_lines')}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={false}
    >
      <p>
        Clearing the table lines will delete all quantities and rate were
        applied to the items, Is this okay?
      </p>
    </Alert>
  );
}

export const ItemsEntriesDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ItemsEntriesDeleteAlertInner);
