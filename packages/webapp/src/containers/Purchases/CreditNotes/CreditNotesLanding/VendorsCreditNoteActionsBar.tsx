import {
  Button,
  Classes,
  NavbarDivider,
  NavbarGroup,
  Intent,
  Alignment,
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useBulkDeleteVendorCreditsDialog } from './hooks/use-bulk-delete-vendor-credits-dialog';
import { useVendorsCreditNoteListContext } from './VendorsCreditNoteListProvider';
import { withVendorActions } from './withVendorActions';
import { withVendorsCreditNotes } from './withVendorsCreditNotes';
import { withVendorsCreditNotesActions } from './withVendorsCreditNotesActions';
import type { WithVendorsCreditNotesProps } from './withVendorsCreditNotes';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
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
import { VendorCreditAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useSaveSettings } from '@/hooks/query';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { compose } from '@/utils';

interface WithVendorsCreditNotesActionsProps {
  setVendorsCreditNoteTableState: (state: Record<string, any>) => void;
}

interface WithVendorActionsProps {
  setVendorCreditsTableState: (state: Record<string, any>) => void;
}

interface VendorsCreditNoteActionsBarProps
  extends Pick<WithVendorsCreditNotesProps, 'vendorsCreditNoteSelectedRows'>,
    WithVendorsCreditNotesActionsProps,
    WithVendorActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {
  vendorCreditFilterRoles: any[];
}

function VendorsCreditNoteActionsBarInner({
  setVendorCreditsTableState,
  vendorCreditFilterRoles,
  vendorsCreditNoteSelectedRows,
  setVendorsCreditNoteTableState,
  openDialog,
  openDrawer,
}: VendorsCreditNoteActionsBarProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const history = useHistory();

  const { VendorCreditsViews, fields, refresh, vendorCreditSettings } =
    useVendorsCreditNoteListContext();
  const creditNoteTableSize = vendorCreditSettings?.tableSize as
    | string
    | undefined;

  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  const handleClickNewVendorCredit = () => {
    history.push('/vendor-credits/new');
  };
  const handleTabChange = (view: { slug?: string } | null) => {
    setVendorCreditsTableState({ viewSlug: view ? view.slug : null });
  };
  const handleRefreshBtnClick = () => {
    refresh();
  };
  const handleTableRowSizeChange = (size: any) => {
    saveSettings({
      options: [{ group: 'vendorCredit', key: 'tableSize', value: size }],
    });
  };
  const handleImportBtnClick = () => {
    history.push('/vendor-credits/import');
  };
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'vendor_credit' });
  };
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'VendorCredit' });
  };
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.CREDIT_NOTE_DETAILS);
  };

  const { openBulkDeleteDialog, isValidatingBulkDeleteVendorCredits } =
    useBulkDeleteVendorCreditsDialog();

  if (!isEmpty(vendorsCreditNoteSelectedRows)) {
    const handleBulkDelete = () => {
      openBulkDeleteDialog(vendorsCreditNoteSelectedRows as number[]);
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
            disabled={isValidatingBulkDeleteVendorCredits}
          />
        </NavbarGroup>
      </DashboardActionsBar>
    );
  }

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
            onFilterChange: (filterConditions: any) => {
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
                text={'Customize Credit Note'}
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

export const VendorsCreditNoteActionsBar = compose(
  withVendorsCreditNotesActions,
  withVendorActions,
  withVendorsCreditNotes(
    ({ vendorsCreditNoteTableState, vendorsCreditNoteSelectedRows }) => ({
      vendorCreditFilterRoles: vendorsCreditNoteTableState.filterRoles,
      vendorsCreditNoteSelectedRows,
    }),
  ),
  withDialogActions,
  withDrawerActions,
)(VendorsCreditNoteActionsBarInner);
