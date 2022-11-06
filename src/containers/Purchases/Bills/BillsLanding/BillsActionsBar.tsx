// @ts-nocheck
import React, { useState } from 'react';
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
import { BillAction, AbilitySubject } from '@/constants/abilityOption';

import withBills from './withBills';
import withBillsActions from './withBillsActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';

import { useBillsListContext } from './BillsListProvider';
import { useRefreshBills } from '@/hooks/query/bills';
import { compose } from '@/utils';

/**
 * Bills actions bar.
 */
function BillActionsBar({
  // #withBillActions
  setBillsTableState,

  // #withBills
  billsConditionsRoles,

  // #withSettings
  billsTableSize,

  // #withSettingsActions
  addSetting,
}) {
  const history = useHistory();

  // Bills refresh action.
  const { refresh } = useRefreshBills();

  // Bills list context.
  const { billsViews, fields } = useBillsListContext();

  // Handle click a new bill.
  const handleClickNewBill = () => {
    history.push('/bills/new');
  };

  // Handle tab change.
  const handleTabChange = (view) => {
    setBillsTableState({
      viewSlug: view ? view.slug : null,
    });
  };
  // Handle click a refresh bills
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('bills', 'tableSize', size);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'bills'}
          views={billsViews}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={BillAction.Create} a={AbilitySubject.Bill}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_bill'} />}
            onClick={handleClickNewBill}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: billsConditionsRoles,
            defaultFieldKey: 'bill_number',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setBillsTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={billsConditionsRoles.length}
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
          initialValue={billsTableSize}
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
  withBillsActions,
  withSettingsActions,
  withBills(({ billsTableState }) => ({
    billsConditionsRoles: billsTableState.filterRoles,
  })),
  withSettings(({ billsettings }) => ({
    billsTableSize: billsettings?.tableSize,
  })),
)(BillActionsBar);
