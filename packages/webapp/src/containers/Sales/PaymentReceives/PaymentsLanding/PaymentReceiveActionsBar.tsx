// @ts-nocheck
import React from 'react';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
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

import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import {
  PaymentReceiveAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { usePaymentReceivesListContext } from './PaymentReceiptsListProvider';
import { useRefreshPaymentReceive } from '@/hooks/query/paymentReceives';
import { compose } from '@/utils';
import { DialogsName } from '@/constants/dialogs';

/**
 * Payment receives actions bar.
 */
function PaymentReceiveActionsBar({
  // #withPaymentReceivesActions
  setPaymentReceivesTableState,

  // #withPaymentReceives
  paymentFilterConditions,

  // #withSettings
  paymentReceivesTableSize,

  // #withSettingsActions
  addSetting,

  // #withDialogActions
  openDialog,
}) {
  // History context.
  const history = useHistory();

  // Payment receives list context.
  const { paymentReceivesViews, fields } = usePaymentReceivesListContext();

  // Handle new payment button click.
  const handleClickNewPaymentReceive = () => {
    history.push('/payment-receives/new');
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
    history.push('/payment-receives/import');
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'payment_receive' });
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
            text={<T id={'new_payment_receive'} />}
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
  withPaymentReceivesActions,
  withSettingsActions,
  withPaymentReceives(({ paymentReceivesTableState }) => ({
    paymentReceivesTableState,
    paymentFilterConditions: paymentReceivesTableState.filterRoles,
  })),
  withSettings(({ paymentReceiveSettings }) => ({
    paymentReceivesTableSize: paymentReceiveSettings?.tableSize,
  })),
  withDialogActions,
)(PaymentReceiveActionsBar);
