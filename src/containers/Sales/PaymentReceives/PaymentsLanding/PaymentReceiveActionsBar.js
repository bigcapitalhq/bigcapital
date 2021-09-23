import React from 'react';
import Icon from 'components/Icon';
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
  DashboardFilterButton,
  AdvancedFilterPopover,
  FormattedMessage as T,
  DashboardRowsHeightButton,
} from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { If, DashboardActionViewsList } from 'components';

import withPaymentReceivesActions from './withPaymentReceivesActions';
import withPaymentReceives from './withPaymentReceives';

import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';

import { compose } from 'utils';
import { usePaymentReceivesListContext } from './PaymentReceiptsListProvider';
import { useRefreshPaymentReceive } from 'hooks/query/paymentReceives';

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
    addSetting('payment_receive', 'tableSize', size);
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
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_payment_receive'} />}
          onClick={handleClickNewPaymentReceive}
        />
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
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'file-export-16'} iconSize={'16'} />}
          text={<T id={'export'} />}
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
)(PaymentReceiveActionsBar);
