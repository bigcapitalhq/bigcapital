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
import { FormattedMessage as T } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import {
  If,
  DashboardActionViewsList,
  DashboardFilterButton,
  AdvancedFilterPopover,
} from 'components';

import withPaymentMade from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';

import { usePaymentMadesListContext } from './PaymentMadesListProvider';
import { useRefreshPaymentMades } from 'hooks/query/paymentMades';

import { compose } from 'utils';

/**
 * Payment made actions bar.
 */
function PaymentMadeActionsBar({
  // #withPaymentMadesActions
  setPaymentMadesTableState,

  // #withPaymentMades
  paymentMadesFilterConditions
}) {
  const history = useHistory();

  // Payment receives list context.
  const { paymentMadesViews, fields } = usePaymentMadesListContext();

  // Handle new payment made button click.
  const handleClickNewPaymentMade = () => {
    history.push('/payment-mades/new');
  };

  // Payment receive refresh action.
  const { refresh } = useRefreshPaymentMades();

  // Handle tab changing.
  const handleTabChange = (customView) => {
    setPaymentMadesTableState({ customViewId: customView.id || null });
  };

  // Handle click a refresh payment receives.
  const handleRefreshBtnClick = () => {
    refresh();
  };
  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'bill_payments'}
          views={paymentMadesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_payment_made'} />}
          onClick={handleClickNewPaymentMade}
        />
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: paymentMadesFilterConditions,
            defaultFieldKey: 'payment_number',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setPaymentMadesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={paymentMadesFilterConditions.length}
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
  withPaymentMade(({ paymentMadesTableState }) => ({
    paymentMadesFilterConditions: paymentMadesTableState.filterRoles,
  })),
)(PaymentMadeActionsBar);
