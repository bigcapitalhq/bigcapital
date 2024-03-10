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
import {
  SaleEstimateAction,
  AbilitySubject,
  SaleInvoiceAction,
} from '@/constants/abilityOption';
import { EstimateMoreMenuItems } from './components';
import {
  DrawerActionsBar,
  Icon,
  FormattedMessage as T,
  Can,
  If,
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

  // Handle convert to invoice.
  const handleConvertEstimate = () => {
    history.push(`/invoices/new?from_estimate_id=${estimateId}`, {
      action: estimateId,
    });
    closeDrawer(DRAWERS.ESTIMATE_DETAILS);
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
        <Can I={SaleInvoiceAction.Create} a={AbilitySubject.Invoice}>
          <If condition={!estimate.is_converted_to_invoice}>
            <Button
              className={Classes.MINIMAL}
              intent={Intent.SUCCESS}
              icon={<Icon icon="tick" />}
              text={<T id={'convert_to_invoice'} />}
              onClick={handleConvertEstimate}
            />
            <NavbarDivider />
          </If>
        </Can>
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
