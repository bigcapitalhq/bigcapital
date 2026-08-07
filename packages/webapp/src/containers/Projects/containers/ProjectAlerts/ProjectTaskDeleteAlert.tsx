// @ts-nocheck
import { Intent, Alert } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useDeleteProjectTask } from '../../hooks';
import { FormattedMessage as T, FormattedHTMLMessage } from '@/components';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { compose } from '@/utils';

/**
 * Project tasks delete alert.
 * @returns
 */
function ProjectTaskDeleteAlertInner({
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

  // handleConfirm delete project task
  const handleConfirmProjectTaskDelete = () => {
    deleteProjectTaskMutate(taskId)
      .then(() => {
        AppToaster.show({
          message: intl.get('project_task.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(({ data: { errors } }) => {})
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
      onConfirm={handleConfirmProjectTaskDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'project_task.alert.once_delete_this_project'}
        />
      </p>
    </Alert>
  );
}

export const ProjectTaskDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ProjectTaskDeleteAlertInner);
