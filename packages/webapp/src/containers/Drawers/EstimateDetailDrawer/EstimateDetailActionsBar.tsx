import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Intent,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { EstimateMoreMenuItems } from './components';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';
import {
  DrawerActionsBar,
  Icon,
  FormattedMessage as T,
  Can,
  If,
} from '@/components';
import {
  SaleEstimateAction,
  AbilitySubject,
  SaleInvoiceAction,
} from '@/constants/abilityOption';
import { DRAWERS } from '@/constants/drawers';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import {
  withDrawerActions,
  WithDrawerActionsProps,
} from '@/containers/Drawer/withDrawerActions';
import { compose } from '@/utils';

interface EstimateDetailActionsBarInnerProps
  extends WithDialogActionsProps,
    WithAlertActionsProps,
    WithDrawerActionsProps {}

/**
 * Estimate read-only details actions bar of the drawer.
 */
function EstimateDetailActionsBarInner({
  // #withDialogActions
  openDialog,

  // #withAlertActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
  openDrawer,
}: EstimateDetailActionsBarInnerProps) {
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
    openDrawer(DRAWERS.ESTIMATE_SEND_MAIL, { estimateId });
  };

  if (!estimate) {
    return null;
  }

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
          <If condition={!estimate.isConvertedToInvoice}>
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

export const EstimateDetailActionsBar = compose(
  withDialogActions,
  withAlertActions,
  withDrawerActions,
)(EstimateDetailActionsBarInner);
