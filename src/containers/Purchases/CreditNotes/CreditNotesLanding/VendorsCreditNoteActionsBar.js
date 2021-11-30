import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
} from '@blueprintjs/core';
import {
  Icon,
  FormattedMessage as T,
  DashboardActionViewsList,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
} from 'components';
import DashboardActionsBar from '../../../../components/Dashboard/DashboardActionsBar';

import { useVendorsCreditNoteListContext } from './VendorsCreditNoteListProvider';

import withVendorsCreditNotes from './withVendorsCreditNotes';
import withVendorsCreditNotesActions from './withVendorsCreditNotesActions';
import withSettings from '../../../Settings/withSettings';
import withSettingsActions from '../../../Settings/withSettingsActions';

import { compose } from 'utils';

/**
 * Vendors Credit note  table actions bar.
 */
function VendorsCreditNoteActionsBar({
  // #withVendorsCreditNotes
  vendorCreditFilterRoles,

  // #withVendorsCreditNotesActions
  setVendorsCreditNoteTableState,

  // #withSettings
  creditNoteTableSize,

  // #withSettingsActions
  addSetting,
}) {
  const history = useHistory();

  // vendor credit list context.
  const { VendorCreditsViews, fields, refresh } =
    useVendorsCreditNoteListContext();

  // Handle click a new Vendor.
  const handleClickNewVendorCredit = () => {
    history.push('/vendor-credits/new');
  };

  // Handle view tab change.
  const handleTabChange = (view) => {
    setVendorsCreditNoteTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle click a refresh credit note.
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('vendorCredits', 'tableSize', size);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          allMenuItem={true}
          resourceName={'vendor_credit'}
          views={VendorCreditsViews}
          allMenuItem={true}
          allMenuItemText={<T id={'all'} />}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'vendor_credits.action.new_vendor_credit'} />}
          onClick={handleClickNewVendorCredit}
        />
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: vendorCreditFilterRoles,
            defaultFieldKey: 'created_at',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setVendorsCreditNoteTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={vendorCreditFilterRoles.length}
          />
        </AdvancedFilterPopover>
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
          initialValue={creditNoteTableSize}
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
  withVendorsCreditNotesActions,
  withSettingsActions,
  withVendorsCreditNotes(({ vendorsCreditNoteTableState }) => ({
    vendorCreditFilterRoles: vendorsCreditNoteTableState.filterRoles,
  })),
  withSettings(({ vendorsCreditNoteSetting }) => ({
    creditNoteTableSize: vendorsCreditNoteSetting?.tableSize,
  })),
)(VendorsCreditNoteActionsBar);
