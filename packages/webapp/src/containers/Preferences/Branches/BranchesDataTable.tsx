import { Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type { Branch } from '@bigcapital/sdk-ts';

import '@/style/pages/Preferences/branchesList.scss';

import { useBranchesContext } from './BranchesProvider';
import { useBranchesTableColumns, ActionsMenu } from './components';
import { DataTable, Card, AppToaster, TableSkeletonRows } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { useMarkBranchAsPrimary } from '@/hooks/query';
import { compose } from '@/utils';

type BranchesDataTableInnerProps = Pick<WithDialogActionsProps, 'openDialog'> &
  Pick<WithAlertActionsProps, 'openAlert'>;

/**
 * Branches data table.
 */
function BranchesDataTableInner({
  // #withDialogAction
  openDialog,

  // #withAlertActions
  openAlert,
}: BranchesDataTableInnerProps) {
  const columns = useBranchesTableColumns();
  const { mutateAsync: markBranchAsPrimaryMutate } = useMarkBranchAsPrimary();

  const { branches, isBranchesLoading, isBranchesFetching } =
    useBranchesContext();

  // Handle edit branch.
  const handleEditBranch = ({ id }: Branch) => {
    openDialog('branch-form', { branchId: id, action: 'edit' });
  };

  // Handle delete branch.
  const handleDeleteBranch = ({ id }: Branch) => {
    openAlert('branch-delete', { branchId: id });
  };

  // Handle mark  branch as primary.
  const handleMarkBranchAsPrimary = ({ id }: Branch) => {
    markBranchAsPrimaryMutate(id).then(() => {
      AppToaster.show({
        message: intl.get('branch.alert.mark_primary_message'),
        intent: Intent.SUCCESS,
      });
    });
  };

  return (
    <BranchesTableCard>
      <BranchesTable
        columns={columns}
        data={branches ?? []}
        loading={isBranchesLoading}
        headerLoading={isBranchesLoading}
        progressBarLoading={isBranchesFetching}
        rowTestId={'branch-row'}
        TableLoadingRenderer={TableSkeletonRows}
        noInitialFetch={true}
        ContextMenu={ActionsMenu}
        payload={{
          onEdit: handleEditBranch,
          onDelete: handleDeleteBranch,
          onMarkPrimary: handleMarkBranchAsPrimary,
        }}
      />
    </BranchesTableCard>
  );
}

export const BranchesDataTable = compose(
  withDialogActions,
  withAlertActions,
)(BranchesDataTableInner);

const BranchesTableCard = styled(Card)`
  padding: 0;
`;

const BranchesTable = styled(DataTable)`
  .table .tr {
    min-height: 38px;

    .td.td-name {
      .bp4-icon {
        margin: 0;
        margin-left: 2px;
        vertical-align: top;
        color: #e1b31d;
      }
    }
  }
`;
