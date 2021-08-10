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
import {
  FormattedMessage as T,
  AdvancedFilterPopover,
  DashboardFilterButton,
} from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { If, DashboardActionViewsList } from 'components';

import { useRefreshInvoices } from 'hooks/query/invoices';
import { useInvoicesListContext } from './InvoicesListProvider';

import withInvoiceActions from './withInvoiceActions';
import withInvoices from './withInvoices';

import { compose } from 'utils';

/**
 * Invoices table actions bar.
 */
function InvoiceActionsBar({
  // #withInvoiceActions
  setInvoicesTableState,

  // #withInvoices
  invoicesFilterRoles,
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
  const handleTabChange = (customView) => {
    setInvoicesTableState({ customViewId: customView.id || null });
  };

  // Handle click a refresh sale invoices
  const handleRefreshBtnClick = () => {
    refresh();
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <DashboardActionViewsList
          resourceName={'invoices'}
          views={invoicesViews}
          onChange={handleTabChange}
        />
        <NavbarDivider />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon={'plus'} />}
          text={<T id={'new_invoice'} />}
          onClick={handleClickNewInvoice}
        />
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
  withInvoices(({ invoicesTableState }) => ({
    invoicesFilterRoles: invoicesTableState.filterRoles,
  })),
)(InvoiceActionsBar);
