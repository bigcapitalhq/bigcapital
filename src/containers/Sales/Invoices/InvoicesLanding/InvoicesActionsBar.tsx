import React from 'react';
import Icon from '@/components/Icon';
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
  FormattedMessage as T,
  AdvancedFilterPopover,
  DashboardFilterButton,
  DashboardRowsHeightButton,
} from '@/components';

import DashboardActionsBar from '@/components/Dashboard/DashboardActionsBar';

import { Can, If, DashboardActionViewsList } from '@/components';
import { SaleInvoiceAction, AbilitySubject } from '@/common/abilityOption';

import { useRefreshInvoices } from '@/hooks/query/invoices';
import { useInvoicesListContext } from './InvoicesListProvider';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withSettings from '@/containers/Settings/withSettings';
import withSettingsActions from '@/containers/Settings/withSettingsActions';
import { compose } from '@/utils';

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
}) {
  const history = useHistory();

  // Sale invoices list context.
  const { invoicesViews, invoicesFields } = useInvoicesListContext();

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
          initialValue={invoicesTableSize}
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
  withInvoiceActions,
  withSettingsActions,
  withInvoices(({ invoicesTableState }) => ({
    invoicesFilterRoles: invoicesTableState.filterRoles,
  })),
  withSettings(({ invoiceSettings }) => ({
    invoicesTableSize: invoiceSettings?.tableSize,
  })),
)(InvoiceActionsBar);
