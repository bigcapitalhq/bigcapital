import React, { useState } from 'react';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  Popover,
  NavbarDivider,
  NavbarGroup,
  PopoverInteractionKind,
  Position,
  Intent,
} from '@blueprintjs/core';

import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';

import { If, DashboardActionViewsList } from 'components';

import { useInvoicesListContext } from './InvoicesListProvider';
import withInvoiceActions from './withInvoiceActions';

import { compose } from 'utils';

/**
 * Invoices table actions bar.
 */
function InvoiceActionsBar({
  // #withInvoiceActions
  setInvoicesTableState,
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const [filterCount, setFilterCount] = useState(0);

  // Sale invoices list context.
  const { invoicesViews } = useInvoicesListContext();

  // Handle new invoice button click.
  const handleClickNewInvoice = () => {
    history.push('/invoices/new');
  };

  // Handle views tab change.
  const handleTabChange = (customView) => {
    setInvoicesTableState({
      customViewId: customView.id || null,
    });
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
        <Popover
          minimal={true}
          // content={filterDropdown}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL)}
            text={
              filterCount <= 0 ? (
                <T id={'filter'} />
              ) : (
                `${filterCount} ${formatMessage({ id: 'filters_applied' })}`
              )
            }
            icon={<Icon icon={'filter-16'} iconSize={16} />}
          />
        </Popover>
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
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(withInvoiceActions)(InvoiceActionsBar);
