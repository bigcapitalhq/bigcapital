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

import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { Icon, FormattedMessage as T } from 'components';

import { compose } from 'utils';

/**
 * Invoice details action bar.
 */
function InvoiceDetailActionsBar({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  // Invoice detail drawer context.
  const { invoiceId } = useInvoiceDetailDrawerContext();

  // Handle edit sale invoice.
  const handleEditInvoice = () => {
    history.push(`/invoices/${invoiceId}/edit`);
    closeDrawer('invoice-detail-drawer');
  };

  // Handle delete sale invoice.
  const handleDeleteInvoice = () => {
    openAlert('invoice-delete', { invoiceId });
    closeDrawer('invoice-detail-drawer');
  };

  // Handle print invoices.
  const handlePrintInvoice = () => {
    openDialog('invoice-pdf-preview', { invoiceId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_invoice'} />}
          onClick={handleEditInvoice}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" />}
          text={<T id={'print'} />}
          onClick={handlePrintInvoice}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={handleDeleteInvoice}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(InvoiceDetailActionsBar);
