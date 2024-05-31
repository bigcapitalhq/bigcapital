// @ts-nocheck
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
  Can,
  FormattedMessage as T,
  DashboardActionViewsList,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';

import { useVendorsCreditNoteListContext } from './VendorsCreditNoteListProvider';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';

import withVendorsCreditNotesActions from './withVendorsCreditNotesActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withVendorsCreditNotes from './withVendorsCreditNotes';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withVendorActions from './withVendorActions';

import { compose } from '@/utils';
import { DialogsName } from '@/constants/dialogs';

/**
 * Vendors Credit note  table actions bar.
 */
function VendorsCreditNoteActionsBar({
  setVendorCreditsTableState,

  // #withVendorsCreditNotes
  vendorCreditFilterRoles,

  // #withVendorsCreditNotesActions
  setVendorsCreditNoteTableState,

  // #withSettings
  creditNoteTableSize,

  // #withSettingsActions
  addSetting,

  // #withDialogActions
  openDialog,
}) {
  const history = useHistory();

  // vendor credit list context.
  const { VendorCreditsViews, fields, refresh } =
    useVendorsCreditNoteListContext();

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Handle click a new Vendor.
  const handleClickNewVendorCredit = () => {
    history.push('/vendor-credits/new');
  };
  // Handle view tab change.
  const handleTabChange = (view) => {
    setVendorCreditsTableState({ viewSlug: view ? view.slug : null });
  };
  // Handle click a refresh credit note.
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('vendorCredit', 'tableSize', size);
  };
  // Handle import button click.
  const handleImportBtnClick = () => {
    history.push('/vendor-credits/import');
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'vendor_credit' });
  };
  // Handle the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'VendorCredit' });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          allMenuItem={true}
          resourceName={'vendor_credit'}
          views={VendorCreditsViews}
          allMenuItemText={<T id={'all'} />}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={VendorCreditAction.Create} a={AbilitySubject.VendorCredit}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'vendor_credits.label.new_vendor_credit'} />}
            onClick={handleClickNewVendorCredit}
          />
        </Can>
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
  withVendorActions,
  withSettingsActions,
  withVendorsCreditNotes(({ vendorsCreditNoteTableState }) => ({
    vendorCreditFilterRoles: vendorsCreditNoteTableState.filterRoles,
  })),
  withSettings(({ vendorsCreditNoteSetting }) => ({
    creditNoteTableSize: vendorsCreditNoteSetting?.tableSize,
  })),
  withDialogActions,
)(VendorsCreditNoteActionsBar);
