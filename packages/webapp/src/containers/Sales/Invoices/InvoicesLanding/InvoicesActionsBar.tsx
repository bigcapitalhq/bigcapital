// @ts-nocheck
import React from 'react';
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
import { useHistory } from 'react-router-dom';
import {
  Icon,
  FormattedMessage as T,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
  DashboardActionsBar,
} from '@/components';

import { Can, If, DashboardActionViewsList } from '@/components';
import { SaleInvoiceAction, AbilitySubject } from '@/constants/abilityOption';

import { useRefreshInvoices } from '@/hooks/query/invoices';
import { useInvoicesListContext } from './InvoicesListProvider';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import { compose } from '@/utils';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { DialogsName } from '@/constants/dialogs';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';
import { DRAWERS } from '@/constants/drawers';

/**
 * Invoices table actions bar.
 */
function InvoiceActionsBar({
  // #withInvoiceActions
  setInvoicesTableState,

  // #withInvoices
  invoicesFilterRoles,

  // #withSettings
  invoicesTableSize,

  // #withSettingsActions
  addSetting,

  // #withDialogsActions
  openDialog,

  // #withDrawerActions
  openDrawer,
}) {
  const history = useHistory();

  // Sale invoices list context.
  const { invoicesViews, invoicesFields } = useInvoicesListContext();

  // Exports pdf document.
  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  // Handle new invoice button click.
  const handleClickNewInvoice = () => {
    history.push('/invoices/new');
  };

  // Invoices refresh action.
  const { refresh } = useRefreshInvoices();

  // Handle views tab change.
  const handleTabChange = (view) => {
    setInvoicesTableState({ viewSlug: view ? view.slug : null });
  };

  // Handle click a refresh sale invoices
  const handleRefreshBtnClick = () => {
    refresh();
  };

  // Handle table row size change.
  const handleTableRowSizeChange = (size) => {
    addSetting('salesInvoices', 'tableSize', size);
  };

  // Handle the import button click.
  const handleImportBtnClick = () => {
    history.push('/invoices/import');
  };

  // Handle the export button click.
  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'sale_invoice' });
  };
  // Handles the print button click.
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'SaleInvoice' });
  };

  // Handles the invoice customize button click.
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'SaleInvoice' });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          allMenuItem={true}
          resourceName={'invoices'}
          views={invoicesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Can I={SaleInvoiceAction.Create} a={AbilitySubject.Invoice}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus'} />}
            text={<T id={'new_invoice'} />}
            onClick={handleClickNewInvoice}
          />
        </Can>
        <AdvancedFilterPopover
          advancedFilterProps={{
            conditions: invoicesFilterRoles,
            defaultFieldKey: 'invoice_no',
            fields: invoicesFields,
            onFilterChange: (filterConditions) => {
              setInvoicesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton conditionsCount={invoicesFilterRoles.length} />
        </AdvancedFilterPopover>

        <NavbarDivider />

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
          initialValue={invoicesTableSize}
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
  withInvoiceActions,
  withSettingsActions,
  withInvoices(({ invoicesTableState }) => ({
    invoicesFilterRoles: invoicesTableState.filterRoles,
  })),
  withSettings(({ invoiceSettings }) => ({
    invoicesTableSize: invoiceSettings?.tableSize,
  })),
  withDialogActions,
  withDrawerActions,
)(InvoiceActionsBar);
