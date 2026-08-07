// @ts-nocheck
import { Intent, Alert } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useProjectStatus } from '../../hooks';
import { FormattedMessage as T, FormattedHTMLMessage } from '@/components';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { compose } from '@/utils';

/**
 * Project status alert.
 * @returns
 */
function ProjectStatusAlertInner({
  name,
  isOpen,
  payload: { projectId, status },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: statusProjectMutate, isLoading } = useProjectStatus();

  // handle cancel alert.
  const handleCancelAlert = () => {
    closeAlert(name);
  };

  // handle confirm alert.
  const handleConfirmAlert = () => {
    const values = {
      status: status !== 'InProgress' ? 'InProgress' : 'Closed',
    };

    statusProjectMutate([projectId, values])
      .then(() => {
        AppToaster.show({
          message: intl.get('projects.alert.status_message'),
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
      confirmButtonText={<T id={'save'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelAlert}
      onConfirm={handleConfirmAlert}
      loading={isLoading}
    >
      <FormattedHTMLMessage id="projects.alert.are_you_sure_you_want" />
    </Alert>
  );
}

export const ProjectStatusAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ProjectStatusAlertInner);
