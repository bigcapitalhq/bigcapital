// @ts-nocheck
import React from 'react';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
  Popover,
  Menu,
  MenuItem,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';

import { useHistory } from 'react-router-dom';
import {
  Icon,
  Can,
  If,
  DashboardFilterButton,
  AdvancedFilterPopover,
  FormattedMessage as T,
  DashboardRowsHeightButton,
  DashboardActionViewsList,
  DashboardActionsBar,
} from '@/components';

import withPaymentsReceived from './withPaymentsReceived';
import withPaymentsReceivedActions from './withPaymentsReceivedActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import {
  PaymentReceiveAction,
  AbilitySubject,
} from '@/constants/abilityOption';

import { usePaymentsReceivedListContext } from './PaymentsReceivedListProvider';
import { useRefreshPaymentReceive } from '@/hooks/query/paymentReceives';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';

import { compose } from '@/utils';
import { DialogsName } from '@/constants/dialogs';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';

/**
 * Payment receives actions bar.
 */
function PaymentsReceivedActionsBar({
  // #withPaymentsReceivedActions
  setPaymentReceivesTableState,

  // #withPaymentsReceived
  paymentFilterConditions,

  // #withSettings
  paymentReceivesTableSize,

  // #withSettingsActions
  addSetting,

  // #withDialogActions
  openDialog,

  // #withDrawerActions
  openDrawer,
}) {
  // History context.
  const history = useHistory();

  // Payment receives list context.
  const { paymentReceivesViews, fields } = usePaymentsReceivedListContext();

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Handle new payment button click.
  const handleClickNewPaymentReceive = () => {
    history.push('/payment-received/new');
  };

  // Payment receive refresh action.
  const { refresh } = useRefreshPaymentReceive();

  // Handle tab changing.
  const handleTabChange = (viewId) => {
    setPaymentReceivesTableState({ customViewId: viewId.id || null });
  };

  // Handle click a refresh payment receives
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('paymentReceives', 'tableSize', size);
  };
  // Handle the import button click.
  const handleImportBtnClick = () => {
    history.push('/payments-received/import');
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'payment_receive' });
  };
  // Handles the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'PaymentReceive' });
  };
  // Handle the customize button click.
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'PaymentReceive' });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'payment_receives'}
          views={paymentReceivesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={PaymentReceiveAction.Create} a={AbilitySubject.PaymentReceive}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_payment_received'} />}
            onClick={handleClickNewPaymentReceive}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: paymentFilterConditions,
            defaultFieldKey: 'payment_receive_no',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setPaymentReceivesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={paymentFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            // onClick={handleBulkDelete}
          />
        </If>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={'16'} />}
          text={<T id={'print'} />}
          onClick={handlePrintBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-import-16'} />}
          text={<T id={'import'} />}
          onClick={handleImportBtnClick}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
          onClick={handleExportBtnClick}
        />

        <NavbarDivider />
        <DashboardRowsHeightButton
          initialValue={paymentReceivesTableSize}
          onChange={handleTableRowSizeChange}
        />
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <Popover
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_RIGHT}
          modifiers={{
            offset: { offset: '0, 4' },
          }}
          content={
            <Menu>
              <MenuItem
                onClick={handleCustomizeBtnClick}
                text={'Customize Templates'}
              />
            </Menu>
          }
        >
          <Button icon={<Icon icon="cog-16" iconSize={16} />} minimal={true} />
        </Popover>
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withPaymentsReceivedActions,
  withSettingsActions,
  withPaymentsReceived(({ paymentReceivesTableState }) => ({
    paymentReceivesTableState,
    paymentFilterConditions: paymentReceivesTableState.filterRoles,
  })),
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceivesTableSize: paymentReceiveSettings?.tableSize,
  })),
  withDialogActions,
  withDrawerActions,
)(PaymentsReceivedActionsBar);
