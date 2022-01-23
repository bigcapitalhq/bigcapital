import React from 'react';
import styled from 'styled-components';

import { DataTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import { useBranchesTableColumns, ActionsMenu } from './components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

/**
 * Branches data table.
 */
function BranchesDataTable({
  // #withDialogAction
  openDialog,
}) {
  // Table columns.
  const columns = useBranchesTableColumns();

  return (
    <BranchesTable
      columns={columns}
      data={[]}
      // loading={}
      // progressBarLoading={}
      TableLoadingRenderer={TableSkeletonRows}
      ContextMenu={ActionsMenu}
      payload={{}}
    />
  );
}

export default compose(withDialogActions)(BranchesDataTable);

const BranchesTable = styled(DataTable)``;
