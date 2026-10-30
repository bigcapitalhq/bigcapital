import { Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { ActionsMenu, useTrackingCategoriesTableColumns } from './components';
import { useTrackingCategoriesContext } from './TrackingCategoriesProvider';
import type { TrackingCategory } from './components';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { AppToaster, Card, DataTable, TableSkeletonRows } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { useEditTrackingCategory } from '@/hooks/query';

type TrackingCategoriesDataTableInnerProps = Pick<
  WithDialogActionsProps,
  'openDialog'
> &
  Pick<WithAlertActionsProps, 'openAlert'>;

/**
 * Tracking categories data table.
 */
function TrackingCategoriesDataTableInner({
  openDialog,
  openAlert,
}: TrackingCategoriesDataTableInnerProps) {
  const columns = useTrackingCategoriesTableColumns();
  const { mutateAsync: editTrackingCategory } = useEditTrackingCategory();

  const {
    trackingCategories,
    isTrackingCategoriesLoading,
    isTrackingCategoriesFetching,
  } = useTrackingCategoriesContext();

  // Handle edit category.
  const handleEditCategory = ({ id }: TrackingCategory) => {
    openDialog(DialogsName.TrackingCategoryForm, {
      categoryId: id,
      action: 'edit',
    });
  };

  // Handle archive/restore category.
  const handleToggleActive = (category: TrackingCategory) => {
    editTrackingCategory([category.id, { active: !category.active }]).then(
      () => {
        AppToaster.show({
          message: intl.get(
            category.active
              ? 'tracking_categories.message.archived'
              : 'tracking_categories.message.restored',
            { name: category.name },
          ),
          intent: Intent.SUCCESS,
        });
      },
    );
  };

  // Handle delete category.
  const handleDeleteCategory = (category: TrackingCategory) => {
    openAlert('tracking-category-delete', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  return (
    <TrackingCategoriesTableCard>
      <TrackingCategoriesTable
        columns={columns}
        data={trackingCategories ?? []}
        loading={isTrackingCategoriesLoading}
        headerLoading={isTrackingCategoriesLoading}
        progressBarLoading={isTrackingCategoriesFetching}
        rowTestId={'tracking-category-row'}
        TableLoadingRenderer={TableSkeletonRows}
        noInitialFetch={true}
        ContextMenu={ActionsMenu}
        payload={{
          onEdit: handleEditCategory,
          onToggleActive: handleToggleActive,
          onDelete: handleDeleteCategory,
        }}
      />
    </TrackingCategoriesTableCard>
  );
}

export const TrackingCategoriesDataTable = FF.pipe(
  TrackingCategoriesDataTableInner,
  withAlertActions,
  withDialogActions,
);

const TrackingCategoriesTableCard = styled(Card)`
  padding: 0;
`;

const TrackingCategoriesTable = styled(DataTable)`
  .table .tr {
    min-height: 40px;
  }
  .tracking-categories-options-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .tracking-categories-option-archived-label {
    opacity: 0.6;
  }
`;
