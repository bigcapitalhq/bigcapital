// @ts-nocheck
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
import { SaleEstimateAction, AbilitySubject } from '@/constants/abilityOption';
import { EstimateMoreMenuItems } from './components';
import {
  DrawerActionsBar,
  Icon,
  FormattedMessage as T,
  Can,
  Choose,
} from '@/components';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';
import { DialogsName } from '@/constants/dialogs';

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
  const { estimateId, estimate } = useEstimateDetailDrawerContext();

  // History.
  const history = useHistory();

  // Handle edit sale estimate.
  const handleEditEstimate = () => {
    history.push(`/estimates/${estimateId}/edit`);
    closeDrawer(DRAWERS.ESTIMATE_DETAILS);
  };

  // Handle cancel/confirm estimate approve.
  const handleApproveEstimate = () => {
    openAlert('estimate-Approve', { estimateId });
  };

  // Handle cancel/confirm estimate reject.
  const handleRejectEstimate = () => {
    openAlert('estimate-reject', { estimateId });
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
  // Handles the estimate mail dialog.
  const handleMailEstimate = () => {
    openDialog(DialogsName.EstimateMail, { estimateId });
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
        <Choose>
          <Choose.When
            condition={estimate.is_delivered && estimate.is_rejected}
          >
            <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon="check" />}
                text={<T id={'mark_as_approved'} />}
                onClick={handleApproveEstimate}
              />
            </Can>
          </Choose.When>
          <Choose.When
            condition={estimate.is_delivered && estimate.is_approved}
          >
            <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon="close-black" />}
                text={<T id={'mark_as_rejected'} />}
                onClick={handleRejectEstimate}
              />
            </Can>
          </Choose.When>
          <Choose.When condition={estimate.is_delivered}>
            <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon="check" />}
                text={<T id={'mark_as_approved'} />}
                onClick={handleApproveEstimate}
              />
            </Can>
            <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
              <Button
                className={Classes.MINIMAL}
                icon={<Icon icon="close-black" />}
                text={<T id={'mark_as_rejected'} />}
                onClick={handleRejectEstimate}
              />
            </Can>
          </Choose.When>
        </Choose>
        <Can I={SaleEstimateAction.View} a={AbilitySubject.Estimate}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="envelope" />}
            text={'Send Mail'}
            onClick={handleMailEstimate}
          />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="print-16" />}
            text={<T id={'print'} />}
            onClick={handlePrintEstimate}
          />
          <NavbarDivider />
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
          <EstimateMoreMenuItems
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
