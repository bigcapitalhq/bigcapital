// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';
import { Alert, Intent } from '@blueprintjs/core';
import { useAssignPdfTemplateAsDefault } from '@/hooks/query/pdf-templates';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Mark default branding template alert.
 */
function MarkDefaultBrandingTemplateAlert({
  // #ownProps
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { templateId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: assignPdfTemplateAsDefault } =
    useAssignPdfTemplateAsDefault();

  const handleConfirmDelete = () => {
    assignPdfTemplateAsDefault({ templateId })
      .then(() => {
        AppToaster.show({
          message:
            'The branding template has been marked as a default template.',
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch((error) => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
        closeAlert(name);
      });
  };

  const handleCancel = () => {
    closeAlert(name);
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={'Mark as Default'}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmDelete}
    >
      <p>
        Are you sure want to mark the given branding template as a default template?
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(MarkDefaultBrandingTemplateAlert);
