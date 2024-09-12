// @ts-nocheck
import React from 'react';
import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Alignment,
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
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

import { useCreditNoteListContext } from './CreditNotesListProvider';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';

import { CreditNoteAction, AbilitySubject } from '@/constants/abilityOption';
import withCreditNotes from './withCreditNotes';
import withCreditNotesActions from './withCreditNotesActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { DialogsName } from '@/constants/dialogs';
import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Credit note table actions bar.
 */
function CreditNotesActionsBar({
  // #withCreditNotes
  creditNoteFilterRoles,

  // #withCreditNotesActions
  setCreditNotesTableState,

  // #withSettings
  creditNoteTableSize,

  // #withSettingsActions
  addSetting,

  // #withDialogActions
  openDialog,

  // #withDrawerActions
  openDrawer
}) {
  const history = useHistory();

  // credit note list context.
  const { CreditNotesView, fields, refresh } = useCreditNoteListContext();

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Handle view tab change.
  const handleTabChange = (view) => {
    setCreditNotesTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle click a new Credit.
  const handleClickNewCreateNote = () => {
    history.push('/credit-notes/new');
  };

  // Handle click a refresh credit note.
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('creditNote', 'tableSize', size);
  };
  // Handle import button click.
  const handleImportBtnClick = () => {
    history.push('/credit-notes/import');
  };
  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'credit_note' });
  };
  // Handle print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'CreditNote' });
  };
  // Handle the customize button click.
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'CreditNote' });
  }

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          allMenuItem={true}
          resourceName={'credit_notes'}
          views={CreditNotesView}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={CreditNoteAction.Create} a={AbilitySubject.CreditNote}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'credit_note.label.new_credit_note'} />}
            onClick={handleClickNewCreateNote}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: creditNoteFilterRoles,
            defaultFieldKey: 'created_at',
            fields: fields,
            onFilterChange: (filterConditions) => {
              setCreditNotesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton
            conditionsCount={creditNoteFilterRoles.length}
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
  withCreditNotesActions,
  withSettingsActions,
  withCreditNotes(({ creditNoteTableState }) => ({
    creditNoteFilterRoles: creditNoteTableState.filterRoles,
  })),
  withSettings(({ creditNoteSettings }) => ({
    creditNoteTableSize: creditNoteSettings?.tableSize,
  })),
  withDialogActions,
  withDrawerActions
)(CreditNotesActionsBar);
