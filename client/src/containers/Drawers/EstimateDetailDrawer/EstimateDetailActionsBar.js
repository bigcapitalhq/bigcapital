import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Icon, FormattedMessage as T } from 'components';

import { safeCallback, compose } from 'utils';

function EstimateDetailActionsBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { estimateId } = useEstimateDetailDrawerContext();

  const history = useHistory();

  // Handle edit sale estimate.
  const onEditEstimate = () => {
    return estimateId
      ? (history.push(`/estimates/${estimateId}/edit`),
        closeDrawer('estimate-detail-drawer'))
      : null;
  };

  // Handle delete sale estimate.
  const onDeleteEstimate = () => {
    return estimateId
      ? (openAlert('estimate-delete', { estimateId }),
        closeDrawer('estimate-detail-drawer'))
      : null;
  };

  // Handle print estimate.
  const onPrintEstimate = () => {
    openDialog('estimate-pdf-preview', { estimateId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_estimate'} />}
          onClick={safeCallback(onEditEstimate)}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" />}
          text={<T id={'print'} />}
          onClick={safeCallback(onPrintEstimate)}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDeleteEstimate)}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withAlertsActions,
  withDrawerActions,
)(EstimateDetailActionsBar);
