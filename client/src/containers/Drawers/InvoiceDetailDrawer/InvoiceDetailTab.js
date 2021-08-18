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

import { safeCallback, compose } from 'utils';

function InvoiceDetailTab({
  invoiceId,
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const history = useHistory();

  // Handle edit sale invoice.
  const onEditInvoice = () => {
    return invoiceId
      ? (history.push(`/invoices/${invoiceId}/edit`),
        closeDrawer('invoice-detail-drawer'))
      : null;
  };

  // Handle delete sale invoice.
  const onDeleteInvoice = () => {
    return invoiceId
      ? (openAlert('invoice-delete', { invoiceId }),
        closeDrawer('invoice-detail-drawer'))
      : null;
  };

  // Handle print invoices.
  const onPrintInvoice = () => {
    openDialog('invoice-pdf-preview', { invoiceId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="pen-18" />}
          text={<T id={'edit_invoice'} />}
          onClick={safeCallback(onEditInvoice)}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" />}
          text={<T id={'print'} />}
          onClick={safeCallback(onPrintInvoice)}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'trash-16'} iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={safeCallback(onDeleteInvoice)}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withDialogActions,
  withDrawerActions,
  withAlertsActions,
)(InvoiceDetailTab);
