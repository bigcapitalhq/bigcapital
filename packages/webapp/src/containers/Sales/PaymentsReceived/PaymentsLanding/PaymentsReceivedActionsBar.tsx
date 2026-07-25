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
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useBulkDeletePaymentReceivesDialog } from './hooks/use-bulk-delete-payment-receives-dialog';
import { usePaymentsReceivedListContext } from './PaymentsReceivedListProvider';
import { withPaymentsReceived } from './withPaymentsReceived';
import { withPaymentsReceivedActions } from './withPaymentsReceivedActions';
import type { WithPaymentsReceivedProps } from './withPaymentsReceived';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  Icon,
  Can,
  DashboardFilterButton,
  AdvancedFilterPopover,
  FormattedMessage as T,
  DashboardRowsHeightButton,
  DashboardActionViewsList,
  DashboardActionsBar,
} from '@/components';
import {
  PaymentReceiveAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useRefreshPaymentReceive } from '@/hooks/query/payment-receives';
import { useSaveSettings } from '@/hooks/query';
import { compose } from '@/utils';

interface WithPaymentsReceivedActionsProps {
  setPaymentReceivesTableState: (state: Record<string, any>) => void;
}

interface PaymentsReceivedActionsBarProps
  extends Pick<WithPaymentsReceivedProps, 'paymentReceivesSelectedRows'>,
    WithPaymentsReceivedActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {
  paymentFilterConditions: any[];
}

function PaymentsReceivedActionsBarInner({
  setPaymentReceivesTableState,
  paymentFilterConditions,
  paymentReceivesSelectedRows,
  openDialog,
  openDrawer,
}: PaymentsReceivedActionsBarProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const history = useHistory();

  const { paymentReceivesViews, fields, paymentReceiveSettings } =
    usePaymentsReceivedListContext();
  const paymentReceivesTableSize = paymentReceiveSettings?.tableSize as
    | string
    | undefined;

  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  const handleClickNewPaymentReceive = () => {
    history.push('/payment-received/new');
  };

  const { refresh } = useRefreshPaymentReceive();

  const handleTabChange = (viewId: { id?: number }) => {
    setPaymentReceivesTableState({ customViewId: viewId.id || null });
  };
  const handleRefreshBtnClick = () => {
    refresh();
  };
  const handleTableRowSizeChange = (size: any) => {
    saveSettings({
      options: [{ group: 'paymentReceives', key: 'tableSize', value: size }],
    });
  };
  const handleImportBtnClick = () => {
    history.push('/payments-received/import');
  };
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'payment_receive' });
  };
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'PaymentReceive' });
  };
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'PaymentReceive' });
  };

  const { openBulkDeleteDialog, isValidatingBulkDeletePaymentReceives } =
    useBulkDeletePaymentReceivesDialog();

  if (!isEmpty(paymentReceivesSelectedRows)) {
    const handleBulkDelete = () => {
      openBulkDeleteDialog(paymentReceivesSelectedRows as number[]);
    };
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeletePaymentReceives}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }
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
            onFilterChange: (filterConditions: any) => {
              setPaymentReceivesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={paymentFilterConditions.length}
          />
        </AdvancedFilterPopover>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'print-16'} iconSize={16} />}
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
          icon={<Icon icon={'file-export-16'} iconSize={16} />}
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

export const PaymentsReceivedActionsBar = compose(
  withPaymentsReceivedActions,
  withPaymentsReceived(
    ({ paymentReceivesTableState, paymentReceivesSelectedRows }) => ({
      paymentReceivesTableState,
      paymentFilterConditions: paymentReceivesTableState.filterRoles,
      paymentReceivesSelectedRows,
    }),
  ),
  withDialogActions,
  withDrawerActions,
)(PaymentsReceivedActionsBarInner);
