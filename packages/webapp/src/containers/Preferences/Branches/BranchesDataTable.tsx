// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Intent } from '@blueprintjs/core';

import '@/style/pages/Preferences/branchesList.scss';

import { DataTable, Card, AppToaster, TableSkeletonRows } from '@/components';
import { useBranchesTableColumns, ActionsMenu } from './components';
import { useBranchesContext } from './BranchesProvider';
import { useMarkBranchAsPrimary } from '@/hooks/query';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Branches data table.
 */
function BranchesDataTable({
  // #withDialogAction
  openDialog,

  // #withAlertActions
  openAlert,
}) {
  // Table columns.
  const columns = useBranchesTableColumns();

  // MarkBranchAsPrimary
  const { mutateAsync: markBranchAsPrimaryMutate } = useMarkBranchAsPrimary();

  const { branches, isBranchesLoading, isBranchesFetching } =
    useBranchesContext();

  // Handle edit branch.
  const handleEditBranch = ({ id }) => {
    openDialog('branch-form', { branchId: id, action: 'edit' });
  };

  // Handle delete branch.
  const handleDeleteBranch = ({ id }) => {
    openAlert('branch-delete', { branchId: id });
  };

  // Handle mark  branch as primary.
  const handleMarkBranchAsPrimary = ({ id }) => {
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
        data={branches}
        loading={isBranchesLoading}
        headerLoading={isBranchesLoading}
        progressBarLoading={isBranchesFetching}
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

export default compose(withDialogActions, withAlertActions)(BranchesDataTable);

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
