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
  Icon,
  AdvancedFilterPopover,
  DashboardFilterButton,
  FormattedMessage as T,
  DashboardRowsHeightButton,
} from '@/components';

import {
  Can,
  If,
  DashboardActionsBar,
  DashboardActionViewsList,
} from '@/components';

import withReceipts from './withReceipts';
import withReceiptsActions from './withReceiptsActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';

import { useReceiptsListContext } from './ReceiptsListProvider';
import { useRefreshReceipts } from '@/hooks/query/receipts';
import { SaleReceiptAction, AbilitySubject } from '@/constants/abilityOption';

import { compose } from '@/utils';

/**
 * Receipts actions bar.
 */
function ReceiptActionsBar({
  // #withReceiptsActions
  setReceiptsTableState,

  // #withReceipts
  receiptsFilterConditions,

  // #withSettings
  receiptsTableSize,

  // #withSettingsActions
  addSetting,
}) {
  const history = useHistory();

  // Sale receipts list context.
  const { receiptsViews, fields } = useReceiptsListContext();

  // Handle new receipt button click.
  const onClickNewReceipt = () => {
    history.push('/receipts/new');
  };

  // Sale receipt refresh action.
  const { refresh } = useRefreshReceipts();

  const handleTabChange = (view) => {
    setReceiptsTableState({
      viewSlug: view ? view.slug : null,
    });
  };

  // Handle click a refresh sale estimates
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('salesReceipts', 'tableSize', size);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'receipts'}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          views={receiptsViews}
          onChange={handleTabChange}
        />

        <NavbarDivider />
        <Can I={SaleReceiptAction.Create} a={AbilitySubject.Receipt}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_receipt'} />}
            onClick={onClickNewReceipt}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: receiptsFilterConditions,
            defaultFieldKey: 'reference_no',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setReceiptsTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={receiptsFilterConditions.length}
          />
        </AdvancedFilterPopover>

        <If condition={false}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
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
          initialValue={receiptsTableSize}
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
  withReceiptsActions,
  withSettingsActions,
  withReceipts(({ receiptTableState }) => ({
    receiptsFilterConditions: receiptTableState.filterRoles,
  })),
  withSettings(({ receiptSettings }) => ({
    receiptsTableSize: receiptSettings?.tableSize,
  })),
)(ReceiptActionsBar);
