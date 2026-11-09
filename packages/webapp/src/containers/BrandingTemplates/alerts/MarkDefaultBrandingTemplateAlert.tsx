import { Alert, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useAssignPdfTemplateAsDefault } from '@/hooks/query/pdf-templates';

interface MarkDefaultBrandingTemplateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { templateId: number };
}

/**
 * Mark default branding template alert.
 */
function MarkDefaultBrandingTemplateAlertInner({
  // #ownProps
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { templateId },

  // #withAlertActions
  closeAlert,
}: MarkDefaultBrandingTemplateAlertProps): React.ReactElement {
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
      .catch((error: Error) => {
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
        Are you sure want to mark the given branding template as a default
        template?
      </p>
    </Alert>
  );
}

export const MarkDefaultBrandingTemplateAlert = FF.pipe(
  MarkDefaultBrandingTemplateAlertInner,
  withAlertActions,
  withAlertStoreConnect(),
);
