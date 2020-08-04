import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  Intent,
  Button,
  Classes,
  Popover,
  Tooltip,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Tag,
} from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';

import Icon from 'components/Icon';
import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import { If } from 'components';
import DataTable from 'components/DataTable';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';
import withEstimates from './withEstimates';
import withEstimateActions from './withEstimateActions';

function EstimatesDataTable({
  //#withEitimates

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withView
  viewMeta,

  //#OwnProps
  loading,
  onFetchData,
  onEditEstimate,
  onDeleteEstimate,
  onSelectedRowsChange,
}) {
  const [initialMount, setInitialMount] = useState(false);
  const { custom_view_id: customViewId } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    setInitialMount(false);
  }, []);

  // useUpdateEffect(() => {
  //   if (!estimateLoading) {
  //     setInitialMount(true);
  //   }
  // }, []);

  useEffect(() => {
    if (customViewId) {
      changeCurrentView(customViewId);
      setTopbarEditView(customViewId);
    }
    changePageSubtitle(customViewId && viewMeta ? viewMeta.name : '');
  }, [
    customViewId,
    changeCurrentView,
    changePageSubtitle,
    setTopbarEditView,
    viewMeta,
  ]);

  const handleEditEstimate = useCallback(
    (estimate) => {
      onEditEstimate && onEditEstimate(estimate);
    },
    [onEditEstimate],
  );

  const handleDeleteEstimate = useCallback(() => {
    onDeleteEstimate && onDeleteEstimate();
  }, [onDeleteEstimate]);

  const actionMenuList = useCallback(
    () => (
      <Menu>
        <MenuItem text={formatMessage({ id: 'view_details' })} />
        <MenuDivider />
        <MenuItem
          text={formatMessage({ id: 'edit_estimate' })}
          // onClick={handleEditEstimate(estimate)}
        />
        <MenuItem
          text={formatMessage({ id: 'delete_estimate' })}
          intent={Intent.DANGER}
          // onClick={handleDeleteEstimate(estimate)}
        />
      </Menu>
    ),
    [handleDeleteEstimate, handleEditEstimate, formatMessage],
  );

  const columns = useMemo(
    () => [
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
      },
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
      },
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
      },
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
      },
      {
        id: '',
        Header: formatMessage({ id: '' }),
        accessor: '',
        className: '',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_BOTTOM}
          >
            <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const handleDataTableFetchData = useCallback(
    (...arguments) => {
      onFetchData && onFetchData(...arguments);
    },
    [onFetchData],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );

  return (
    <div>
      <LoadingIndicator loading={loading} mount={false}>
        <DataTable
          columns={columns}
          data={[]}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
        />
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withRouter,
  withDialogActions,
  withDashboardActions,
  withEstimateActions,
  // withEstimates(({}) => ({})),
  withViewDetails(),
)(EstimatesDataTable);
