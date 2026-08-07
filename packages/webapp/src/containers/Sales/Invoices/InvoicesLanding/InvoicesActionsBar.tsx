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
import { useBulkDeleteInvoicesDialog } from '../hooks/use-bulk-delete-accounts-dialog';
import { useInvoicesListContext } from './InvoicesListProvider';
import { withInvoiceActions } from './withInvoiceActions';
import { withInvoices } from './withInvoices';
import type { WithInvoicesProps } from './withInvoices';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
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
import { DialogsName } from '@/constants/dialogs';
import { DRAWERS } from '@/constants/drawers';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDownloadExportPdf } from '@/hooks/query/FinancialReports/use-export-pdf';
import { useRefreshInvoices } from '@/hooks/query/invoices';
import { useSaveSettings } from '@/hooks/query';
import { compose } from '@/utils';

interface WithInvoiceActionsProps {
  setInvoicesTableState: (state: Record<string, any>) => void;
}

interface InvoiceActionsBarProps
  extends Pick<WithInvoicesProps, 'invoicesSelectedRows'>,
    WithInvoiceActionsProps,
    WithDialogActionsProps,
    WithDrawerActionsProps {
  invoicesFilterRoles: any[];
}

function InvoiceActionsBar({
  setInvoicesTableState,
  invoicesFilterRoles,
  invoicesSelectedRows = [],
  openDialog,
  openDrawer,
}: InvoiceActionsBarProps) {
  const { mutateAsync: saveSettings } = useSaveSettings();

  const history = useHistory();
  const { openBulkDeleteDialog, isValidatingBulkDeleteInvoices } =
    useBulkDeleteInvoicesDialog();

  const { invoicesViews, invoicesFields, invoiceSettings } =
    useInvoicesListContext();
  const invoicesTableSize = invoiceSettings?.tableSize as string | undefined;

  const { downloadAsync: downloadExportPdf } = useDownloadExportPdf();

  const handleClickNewInvoice = () => {
    history.push('/invoices/new');
  };

  const { refresh } = useRefreshInvoices();

  const handleTabChange = (view: { slug?: string } | null) => {
    setInvoicesTableState({ viewSlug: view ? view.slug : null });
  };

  const handleRefreshBtnClick = () => {
    refresh();
  };

  const handleTableRowSizeChange = (size: any) => {
    saveSettings({
      options: [{ group: 'salesInvoices', key: 'tableSize', value: size }],
    });
  };

  const handleImportBtnClick = () => {
    history.push('/invoices/import');
  };

  const handleExportBtnClick = () => {
    openDialog(DialogsName.Export, { resource: 'sale_invoice' });
  };
  const handlePrintBtnClick = () => {
    downloadExportPdf({ resource: 'SaleInvoice' });
  };

  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'SaleInvoice' });
  };

  const handleBulkDelete = () => {
    openBulkDeleteDialog(invoicesSelectedRows as number[]);
  };

  if (!isEmpty(invoicesSelectedRows)) {
    return (
      <DashboardActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleBulkDelete}
            disabled={isValidatingBulkDeleteInvoices}
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
            onFilterChange: (filterConditions: any) => {
              setInvoicesTableState({ filterRoles: filterConditions });
            },
          }}
        >
          <DashboardFilterButton conditionsCount={invoicesFilterRoles.length} />
        </AdvancedFilterPopover>

        <NavbarDivider />
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

export const InvoicesActionsBar = compose(
  withInvoiceActions,
  withInvoices(({ invoicesTableState, invoicesSelectedRows }) => ({
    invoicesFilterRoles: invoicesTableState.filterRoles,
    invoicesSelectedRows,
  })),
  withDialogActions,
  withDrawerActions,
)(InvoiceActionsBar);
