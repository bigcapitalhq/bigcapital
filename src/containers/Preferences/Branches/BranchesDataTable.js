import React from 'react';
import styled from 'styled-components';

import { DataTable } from 'components';
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

  const Time = true;

  const { branches, isBranchesLoading, isBranchesFetching } =
    useBranchesContext();

  const handleEditBranch = ({ id }) => {
    openDialog('branch-form', { branchId: id, action: 'edit' });
  };

  const handleDeleteBranch = ({ id }) => {
    openAlert('branch-delete', { branchId: id });
  };

  if (Time) {
    return <BranchesEmptyStatus />;
  }

  return (
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
      }}
    />
  );
}

export default compose(withDialogActions, withAlertActions)(BranchesDataTable);

const BranchesTable = styled(DataTable)``;
