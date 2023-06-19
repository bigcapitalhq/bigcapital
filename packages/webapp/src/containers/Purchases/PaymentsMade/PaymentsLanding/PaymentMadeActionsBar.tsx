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
  If,
  Can,
  Icon,
  FormattedMessage as T,
  DashboardActionViewsList,
  DashboardFilterButton,
  AdvancedFilterPopover,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';

import withPaymentMade from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';

import { usePaymentsMadeListContext } from './PaymentsMadeListProvider';
import { useRefreshPaymentsMade } from '@/hooks/query/paymentsMade';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';

import { compose } from '@/utils';

/**
 * Payment made actions bar.
 */
function PaymentMadeActionsBar({
  // #withPaymentsMadeActions
  setPaymentsMadeTableState,

  // #withPaymentsMade
  paymentsMadeFilterConditions,

  // #withSettings
  paymentsMadeTableSize,

  // #withSettingsActions
  addSetting,
}) {
  const history = useHistory();

  // Payment receives list context.
  const { paymentsMadeViews, fields } = usePaymentsMadeListContext();

  // Payment receive refresh action.
  const { refresh } = useRefreshPaymentsMade();

  // Handle new payment made button click.
  const handleClickNewPaymentMade = () => {
    history.push('/payments-made/new');
  };

  // Handle tab changing.
  const handleTabChange = (viewSlug) => {
    setPaymentsMadeTableState({ viewSlug });
  };

  // Handle click a refresh payment receives.
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('billPayments', 'tableSize', size);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'bill_payments'}
          views={paymentsMadeViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={PaymentMadeAction.Create} a={AbilitySubject.PaymentMade}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_payment_made'} />}
            onClick={handleClickNewPaymentMade}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: paymentsMadeFilterConditions,
            defaultFieldKey: 'payment_number',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setPaymentsMadeTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={paymentsMadeFilterConditions.length}
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
          initialValue={paymentsMadeTableSize}
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
  withPaymentMadeActions,
  withSettingsActions,
  withPaymentMade(({ paymentsMadeTableState }) => ({
    paymentsMadeFilterConditions: paymentsMadeTableState.filterRoles,
  })),
  withSettings(({ billPaymentSettings }) => ({
    paymentsMadeTableSize: billPaymentSettings?.tableSize,
  })),
)(PaymentMadeActionsBar);
