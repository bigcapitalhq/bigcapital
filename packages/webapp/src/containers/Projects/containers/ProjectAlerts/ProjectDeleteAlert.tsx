// @ts-nocheck
import { Intent, Alert } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useDeleteProject } from '../../hooks';
import { FormattedMessage as T, FormattedHTMLMessage } from '@/components';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { compose } from '@/utils';

/**
 * Project delete alert.
 */
function ProjectDeleteAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { projectId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { mutateAsync: deleteProjectMutate, isLoading } = useDeleteProject();

  // handle cancel delete project alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handleConfirm delete project
  const handleConfirmProjectDelete = () => {
    deleteProjectMutate(projectId)
      .then(() => {
        AppToaster.show({
          message: intl.get('projects.alert.delete_message'),
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
      onConfirm={handleConfirmProjectDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage id={'projects.alert.once_delete_this_project'} />
      </p>
    </Alert>
  );
}

export const ProjectDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ProjectDeleteAlertInner);
