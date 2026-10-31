import { Alert, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useDeleteTrackingCategory } from '@/hooks/query';

interface TrackingCategoryDeleteAlertPayload {
  categoryId: number | string;
  categoryName: string;
}

interface TrackingCategoryDeleteAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: TrackingCategoryDeleteAlertPayload;
}

/**
 * Tracking category delete alert.
 */
function TrackingCategoryDeleteAlertInner({
  name,
  isOpen,
  payload: { categoryId, categoryName },
  closeAlert,
}: TrackingCategoryDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteTrackingCategory, isPending: isLoading } =
    useDeleteTrackingCategory();

  const handleCancelDelete = () => {
    closeAlert(name);
  };

  const handleConfirmDelete = () => {
    deleteTrackingCategory(categoryId)
      .then(() => {
        AppToaster.show({
          message: intl.get('tracking_categories.message.deleted', {
            name: categoryName,
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({ data: { errors } }: { data: { errors: { type: string }[] } }) => {
          if (
            errors?.some(
              (error) => error.type === 'TRACKING_CATEGORY_HAS_ASSIGNMENTS',
            )
          ) {
            AppToaster.show({
              message: intl.get('tracking_categories.error.in_use'),
              intent: Intent.DANGER,
            });
          } else {
            AppToaster.show({
              message: intl.get('tracking_categories.error.delete_failed'),
              intent: Intent.DANGER,
            });
          }
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDelete}
      onConfirm={handleConfirmDelete}
      loading={isLoading}
    >
      <p data-testId={'tracking-category-delete-alert'}>
        {intl.get('tracking_categories.alert.delete_message', {
          name: categoryName,
        })}
      </p>
    </Alert>
  );
}

export const TrackingCategoryDeleteAlert = FF.pipe(
  TrackingCategoryDeleteAlertInner,
  withAlertActions,
  withAlertStoreConnect(),
);
