import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';

import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import {
  SaleEstimateAction,
  AbilitySubject,
} from '../../../common/abilityOption';

import {
  DrawerActionsBar,
  Icon,
  FormattedMessage as T,
  MoreMenuItems,
  Can,
} from '@/components';

import { compose } from '@/utils';

/**
 * Estimate read-only details actions bar of the drawer.
 */
function EstimateDetailActionsBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  // Estimate details drawer context.
  const { estimateId } = useEstimateDetailDrawerContext();

  // History.
  const history = useHistory();

  // Handle edit sale estimate.
  const handleEditEstimate = () => {
    history.push(`/estimates/${estimateId}/edit`);
    closeDrawer('estimate-detail-drawer');
  };

  // Handle delete sale estimate.
  const handleDeleteEstimate = () => {
    openAlert('estimate-delete', { estimateId });
  };

  // Handle print estimate.
  const handlePrintEstimate = () => {
    openDialog('estimate-pdf-preview', { estimateId });
  };
  // Handle notify via SMS.
  const handleNotifyViaSMS = () => {
    openDialog('notify-estimate-via-sms', { estimateId });
  };

  return (
    <DrawerActionsBar>
      <NavbarGroup>
        <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_estimate'} />}
            onClick={handleEditEstimate}
          />
          <NavbarDivider />
        </Can>
        <Can I={SaleEstimateAction.View} a={AbilitySubject.Estimate}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="print-16" />}
            text={<T id={'print'} />}
            onClick={handlePrintEstimate}
          />
        </Can>
        <Can I={SaleEstimateAction.Delete} a={AbilitySubject.Estimate}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteEstimate}
          />
        </Can>
        <Can I={SaleEstimateAction.NotifyBySms} a={AbilitySubject.Estimate}>
          <NavbarDivider />
          <MoreMenuItems
            payload={{
              onNotifyViaSMS: handleNotifyViaSMS,
            }}
          />
        </Can>
      </NavbarGroup>
    </DrawerActionsBar>
  );
}

export default compose(
  withDialogActions,
  withAlertsActions,
  withDrawerActions,
)(EstimateDetailActionsBar);
