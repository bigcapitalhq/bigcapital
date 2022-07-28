import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, FormattedHTMLMessage } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from '@/components';
import { useDeleteProjectTask } from '../../hooks';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Project tasks delete alert.
 * @returns
 */
function ProjectTaskDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { taskId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: deleteProjectTaskMutate, isLoading } =
    useDeleteProjectTask();

  // handle cancel delete alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handleConfirm delete project
  const handleConfirmProjectDelete = () => {
    deleteProjectTaskMutate(taskId)
      .then(() => {
        AppToaster.show({
          message: intl.get('projects.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {},
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmProjectDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage id={'projects.alert.once_delete_this_project'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ProjectTaskDeleteAlert);
