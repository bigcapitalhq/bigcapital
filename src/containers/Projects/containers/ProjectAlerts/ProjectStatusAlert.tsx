// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, FormattedHTMLMessage } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from '@/components';
import { useProjectStatus } from '../../hooks';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Project status alert.
 * @returns
 */
function ProjectStatusAlert({
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

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ProjectStatusAlert);
