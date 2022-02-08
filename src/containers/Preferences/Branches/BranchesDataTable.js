import React from 'react';
import styled from 'styled-components';

import 'style/pages/Preferences/branchesList.scss';

import { DataTable, Card } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import BranchesEmptyStatus from './BranchesEmptyStatus';
import { useBranchesTableColumns, ActionsMenu } from './components';
import { useBranchesContext } from './BranchesProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

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

   // Handle mark primary branch.
  const handleMarkPrimaryBranch = ({ id }) => {
    openAlert('branch-mark-primary', { branchId: id });
  };

  // if (type) {
  //   return <BranchesEmptyStatus />;
  // }

  return (
    <BranchesTableCard>
      <DataTable
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
          onMarkPrimary: handleMarkPrimaryBranch,
        }}
      />
    </BranchesTableCard>
  );
}

export default compose(withDialogActions, withAlertActions)(BranchesDataTable);

const BranchesTableCard = styled(Card)`
  padding: 0;
`;
