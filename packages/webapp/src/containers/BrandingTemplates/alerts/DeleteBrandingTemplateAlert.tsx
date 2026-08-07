// @ts-nocheck
import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useDeletePdfTemplate } from '@/hooks/query/pdf-templates';
import { compose } from '@/utils';

/**
 * Delete branding template alert.
 */
function DeleteBrandingTemplateAlertInner({
  // #ownProps
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { templateId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: deleteBrandingTemplateMutate } = useDeletePdfTemplate();

  const handleConfirmDelete = () => {
    deleteBrandingTemplateMutate({ templateId })
      .then(() => {
        AppToaster.show({
          message: 'The branding template has been deleted successfully.',
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch(({ data: { errors } }) => {
        if (
          errors.find(
            (error) => error.type === 'CANNOT_DELETE_PREDEFINED_PDF_TEMPLATE',
          )
        ) {
          AppToaster.show({
            message: 'Cannot delete a predefined branding template.',
            intent: Intent.DANGER,
          });
        } else {
          AppToaster.show({
            message: 'Something went wrong.',
            intent: Intent.DANGER,
          });
        }
        closeAlert(name);
      });
  };

  const handleCancel = () => {
    closeAlert(name);
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmDelete}
    >
      <p>Are you sure want to delete branding template?</p>
    </Alert>
  );
}

export const DeleteBrandingTemplateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(DeleteBrandingTemplateAlertInner);
